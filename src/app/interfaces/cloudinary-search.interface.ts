interface CreatedBy {
  access_key: string;
  custom_id: string;
  external_id: string;
}

interface UploadedBy {
  access_key: string;
  custom_id: string;
  external_id: string;
}

export interface Resource {
  asset_id: string;
  public_id: string;
  asset_folder: string;
  filename: string;
  display_name: string;
  format: string;
  version: number;
  resource_type: string;
  type: string;
  created_at: string;
  uploaded_at: string;
  bytes: number;
  backup_bytes: number;
  width: number;
  height: number;
  aspect_ratio: number;
  pixels: number;
  url: string;
  secure_url: string;
  status: string;
  access_mode: string;
  access_control: null | any;
  etag: string;
  created_by: CreatedBy;
  uploaded_by: UploadedBy;
}

export interface CloudinaryApiResponse {
  total_count: number;
  time: number;
  next_cursor: string;
  resources: Resource[];
}
