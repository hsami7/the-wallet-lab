'use server'

import { createClient } from '@/utils/supabase/server'
import { revalidatePath } from 'next/cache'

export async function updateProfile(data: { phone?: string, full_name?: string, email?: string }) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    throw new Error('Not authenticated')
  }

  // Handle email update via Auth API
  if (data.email && data.email !== user.email) {
    const { error: authError } = await supabase.auth.updateUser({ email: data.email })
    if (authError) throw new Error(authError.message)
  }

  // Handle profile table updates
  const profileData = { ...data }
  delete profileData.email // Don't try to save email to profiles table

  if (Object.keys(profileData).length > 0) {
    const { error } = await supabase
      .from('profiles')
      .update(profileData)
      .eq('id', user.id)

    if (error) throw new Error(error.message)
  }

  revalidatePath('/account')
  revalidatePath('/admin')
  return { success: true }
}
