'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { headers } from 'next/headers'
import { createClient } from '@/utils/supabase/server'

export async function login(formData: FormData) {
  const supabase = await createClient()

  const data = {
    email: (formData.get('email') as string).trim(),
    password: formData.get('password') as string,
  }

  const { error, data: authData } = await supabase.auth.signInWithPassword(data)

  if (error) {
    redirect(`/login?error=${encodeURIComponent(error.message)}`)
  }

  // Check user role
  let redirectUrl = '/'
  if (authData.user) {
    const { data: profile } = await supabase
      .from('profiles')
      .select('role')
      .eq('id', authData.user.id)
      .single()
      
    if (profile && (profile.role === 'admin' || profile.role === 'Administrator')) {
      redirectUrl = '/admin'
    }
  }

  revalidatePath('/', 'layout')
  redirect(redirectUrl)
}

export async function signup(formData: FormData) {
  const supabase = await createClient()

  const data = {
    email: (formData.get('email') as string).trim(),
    password: formData.get('password') as string,
    options: {
      data: {
        full_name: formData.get('fullName') as string,
      }
    }
  }

  const { error, data: authData } = await supabase.auth.signUp(data)

  if (error) {
    redirect(`/login?error=${encodeURIComponent(error.message)}`)
  }

  // Manually ensure profile is created if trigger is missing
  if (authData.user) {
    const { error: profileError } = await supabase
      .from('profiles')
      .upsert({
        id: authData.user.id,
        email: authData.user.email,
        full_name: data.options.data.full_name,
        role: 'customer' // Default role
      })
      .select();
    
    if (profileError) {
      console.warn("Manual profile creation failed (likely handled by trigger):", profileError.message);
    }
  }

  // If Supabase confirms the user needs to check their email:
  if (authData.user && authData.session === null) {
      redirect('/login?message=Account created! Please check your email to verify your account.')
  }

  revalidatePath('/', 'layout')
  redirect('/')
}

export async function logout() {
  const supabase = await createClient()
  await supabase.auth.signOut()
  
  revalidatePath('/', 'layout')
  redirect('/login')
}

export async function forgotPassword(formData: FormData) {
  const supabase = await createClient()
  const email = (formData.get('email') as string).trim()
  const origin = (await headers()).get("origin");

  const { error } = await supabase.auth.resetPasswordForEmail(email, {
    redirectTo: `${origin}/auth/callback?next=/reset-password`,
  })

  if (error) {
    redirect(`/login?error=${encodeURIComponent(error.message)}`)
  }

  redirect('/login?message=Check your email for the password reset link.')
}

export async function updatePassword(formData: FormData) {
  const supabase = await createClient()
  const password = formData.get('password') as string

  const { error } = await supabase.auth.updateUser({
    password: password
  })

  if (error) {
    redirect(`/reset-password?error=${encodeURIComponent(error.message)}`)
  }

  redirect('/login?message=Password updated successfully! Please sign in.')
}

export async function signUpUser(email: string, password: string, fullName: string) {
  const supabase = await createClient()

  const { error, data: authData } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: {
        full_name: fullName,
      }
    }
  })

  if (error) {
    return { error: error.message }
  }

  // Manually ensure profile is created if trigger is missing
  if (authData.user) {
    const { error: profileError } = await supabase
      .from('profiles')
      .upsert({
        id: authData.user.id,
        email: authData.user.email,
        full_name: fullName,
        role: 'customer' // Default role
      })
    
    if (profileError) {
      console.warn("Manual profile creation failed:", profileError.message)
    }
  }

  return { success: true }
}
