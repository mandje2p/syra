import { supabase } from '../lib/supabase';

export interface Partner {
  id: string;
  name: string;
  logo_url: string;
  website_url: string;
  created_at: string;
  updated_at: string;
}

export interface PartnerFormData {
  name: string;
  website_url: string;
  logo_file: File | null;
}

export async function getAllPartners(): Promise<Partner[]> {
  const { data, error } = await supabase
    .from('partners')
    .select('*')
    .order('name', { ascending: true });

  if (error) {
    throw new Error(`Failed to fetch partners: ${error.message}`);
  }

  return data || [];
}

export async function createPartner(formData: PartnerFormData): Promise<Partner> {
  if (!formData.logo_file) {
    throw new Error('Logo file is required');
  }

  const logoUrl = await uploadLogo(formData.logo_file);

  const { data, error } = await supabase
    .from('partners')
    .insert({
      name: formData.name,
      logo_url: logoUrl,
      website_url: formData.website_url,
      updated_at: new Date().toISOString(),
    })
    .select()
    .single();

  if (error) {
    await deleteLogo(logoUrl);
    throw new Error(`Failed to create partner: ${error.message}`);
  }

  return data;
}

export async function updatePartner(
  partnerId: string,
  formData: PartnerFormData,
  currentLogoUrl: string
): Promise<Partner> {
  let logoUrl = currentLogoUrl;

  if (formData.logo_file) {
    await deleteLogo(currentLogoUrl);
    logoUrl = await uploadLogo(formData.logo_file);
  }

  const { data, error } = await supabase
    .from('partners')
    .update({
      name: formData.name,
      logo_url: logoUrl,
      website_url: formData.website_url,
      updated_at: new Date().toISOString(),
    })
    .eq('id', partnerId)
    .select()
    .single();

  if (error) {
    if (formData.logo_file) {
      await deleteLogo(logoUrl);
    }
    throw new Error(`Failed to update partner: ${error.message}`);
  }

  return data;
}

export async function deletePartner(partnerId: string, logoUrl: string): Promise<void> {
  const { error } = await supabase
    .from('partners')
    .delete()
    .eq('id', partnerId);

  if (error) {
    throw new Error(`Failed to delete partner: ${error.message}`);
  }

  await deleteLogo(logoUrl);
}

async function uploadLogo(file: File): Promise<string> {
  if (!file.type.startsWith('image/')) {
    throw new Error('File must be an image');
  }

  if (file.size > 5 * 1024 * 1024) {
    throw new Error('File size must be less than 5MB');
  }

  const fileExt = file.name.split('.').pop();
  const fileName = `${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExt}`;
  const filePath = `${fileName}`;

  const { error: uploadError } = await supabase.storage
    .from('partner-logos')
    .upload(filePath, file, {
      cacheControl: '3600',
      upsert: false,
    });

  if (uploadError) {
    throw new Error(`Failed to upload logo: ${uploadError.message}`);
  }

  const { data: { publicUrl } } = supabase.storage
    .from('partner-logos')
    .getPublicUrl(filePath);

  return publicUrl;
}

async function deleteLogo(logoUrl: string): Promise<void> {
  try {
    const urlParts = logoUrl.split('/');
    const fileName = urlParts[urlParts.length - 1];

    await supabase.storage
      .from('partner-logos')
      .remove([fileName]);
  } catch (error) {
    console.error('Failed to delete logo:', error);
  }
}
