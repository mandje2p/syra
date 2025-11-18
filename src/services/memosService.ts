import { supabase } from '../lib/supabase';
import { Memo } from '../types';

export async function createMemo(
  userId: string,
  organizationId: string,
  title: string,
  description: string | null,
  dueDate: string,
  dueTime: string
): Promise<Memo> {
  const { data, error } = await supabase
    .from('memos')
    .insert({
      user_id: userId,
      organization_id: organizationId,
      title,
      description,
      due_date: dueDate,
      due_time: dueTime,
      status: 'pending',
    })
    .select()
    .single();

  if (error) {
    throw new Error(`Erreur lors de la création du mémo: ${error.message}`);
  }

  return data;
}

export async function getMemosByUser(userId?: string): Promise<Memo[]> {
  const query = supabase
    .from('memos')
    .select('*')
    .eq('status', 'pending')
    .order('due_date', { ascending: true })
    .order('due_time', { ascending: true });

  if (userId) {
    query.eq('user_id', userId);
  }

  const { data, error } = await query;

  if (error) {
    throw new Error(`Erreur lors du chargement des mémos: ${error.message}`);
  }

  return data || [];
}

export async function getUpcomingMemos(userId: string, days: number = 7): Promise<Memo[]> {
  const today = new Date();
  const futureDate = new Date();
  futureDate.setDate(today.getDate() + days);

  const { data, error } = await supabase
    .from('memos')
    .select('*')
    .eq('user_id', userId)
    .eq('status', 'pending')
    .gte('due_date', today.toISOString().split('T')[0])
    .lte('due_date', futureDate.toISOString().split('T')[0])
    .order('due_date', { ascending: true })
    .order('due_time', { ascending: true });

  if (error) {
    throw new Error(`Erreur lors du chargement des mémos à venir: ${error.message}`);
  }

  return data || [];
}

export async function updateMemoStatus(memoId: string, status: 'pending' | 'completed'): Promise<void> {
  const { error } = await supabase
    .from('memos')
    .update({ status, updated_at: new Date().toISOString() })
    .eq('id', memoId);

  if (error) {
    throw new Error(`Erreur lors de la mise à jour du statut du mémo: ${error.message}`);
  }
}

export async function completeMemo(memoId: string): Promise<void> {
  return updateMemoStatus(memoId, 'completed');
}

export async function restoreMemo(memoId: string): Promise<void> {
  return updateMemoStatus(memoId, 'pending');
}

export async function deleteMemo(memoId: string): Promise<void> {
  const { error } = await supabase
    .from('memos')
    .delete()
    .eq('id', memoId);

  if (error) {
    throw new Error(`Erreur lors de la suppression du mémo: ${error.message}`);
  }
}

export async function updateMemo(
  memoId: string,
  updates: {
    title?: string;
    description?: string | null;
    due_date?: string;
    due_time?: string;
  }
): Promise<void> {
  const { error } = await supabase
    .from('memos')
    .update({ ...updates, updated_at: new Date().toISOString() })
    .eq('id', memoId);

  if (error) {
    throw new Error(`Erreur lors de la mise à jour du mémo: ${error.message}`);
  }
}
