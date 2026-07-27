import type { SupabaseClient } from '@supabase/supabase-js'

/**
 * บันทึกการคัดลอก prompt หนึ่งครั้ง
 *
 * กติกา: ยอดที่โชว์นับเป็น "จำนวนคน" ไม่ใช่จำนวนครั้ง
 * คนเดิมกดซ้ำได้ไม่จำกัด แต่ยอดขึ้นแค่ครั้งแรกครั้งเดียว
 *
 * แยกออกมาไว้ที่เดียวเพราะมีปุ่มคัดลอกสองที่ (หน้ารายละเอียด กับปุ่มด่วนบนการ์ด)
 * ถ้าปล่อยให้แต่ละที่เขียนเอง กติกาจะเพี้ยนกันเมื่อแก้ทีหลัง
 *
 * @returns counted = true เมื่อยอดถูกบวกเพิ่มจริง (คนนี้เพิ่งคัดลอกครั้งแรก)
 */
export async function recordCopy(
  supabase: SupabaseClient,
  promptId: string
): Promise<{ counted: boolean }> {
  const {
    data: { user },
  } = await supabase.auth.getUser()

  let counted = false

  if (user) {
    const { count } = await supabase
      .from('usage_history')
      .select('history_id', { count: 'exact', head: true })
      .eq('prompt_id', promptId)
      .eq('user_id', user.id)
      .eq('action_type', 'copy')

    counted = (count ?? 0) === 0
  }

  // บันทึกประวัติทุกครั้ง หน้าประวัติการใช้งานจะได้เห็นการกดซ้ำด้วย
  await supabase.from('usage_history').insert({
    prompt_id: promptId,
    user_id: user?.id ?? null,
    action_type: 'copy',
  })

  if (counted) {
    await supabase.rpc('increment_copy_count', { prompt_id_input: promptId })
  }

  return { counted }
}
