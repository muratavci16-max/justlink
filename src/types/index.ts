export type DeviceType = "ios" | "android" | "web";

export interface Link {
  id: string;
  user_id: string;
  name: string;
  slug: string;
  ios_url: string | null;
  android_url: string | null;
  web_url: string;
  is_active: boolean;
  expires_at: string | null;
  created_at: string;
  updated_at: string;
}

export interface Click {
  id: string;
  link_id: string;
  timestamp: string;
  device: DeviceType | string;
  country: string | null;
  referrer: string | null;
  ip: string | null;
}

export interface LinkWithStats extends Link {
  total_clicks: number;
}

export interface ClickStats {
  date: string;
  clicks: number;
}

export interface DeviceStats {
  device: string;
  count: number;
}

export interface ReferrerStats {
  referrer: string;
  count: number;
}

export interface AnalyticsData {
  total_clicks: number;
  clicks_over_time: ClickStats[];
  device_breakdown: DeviceStats[];
  top_referrers: ReferrerStats[];
}
