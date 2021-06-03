export interface ItemMoney {
  price: number;
  symbol: string;
  description?: string;
}

export interface Iconfig {
  path: string;
  value: Object;
}

export interface IwelcomeCreditsItem {
  id: number;
  reason: string;
  credits: number;
  created: Date;
}
export interface IwelcomeCreditsInfo {
  description: string;
  labels: { name: string; description: string }[];
}
export interface IwelcomeCreditsValue {
  data: IwelcomeCreditsItem[];
  info: IwelcomeCreditsInfo;
}
