/** کاتالوگ فنی: متریال‌ها، فرآیندها، سطوح کنترل کیفیت، پوشش‌ها
 *  قیمت‌ها نمایشی هستند (برای نسخه ارائه) و باید بعداً از API خوانده شوند.
 */
export type Material = {
  id: string; name: string; family: 'فولاد ساختمانی' | 'فولاد عملیات‌پذیر' | 'فولاد ضدسایش' | 'فولاد زنگ‌نزن' | 'آلومینیوم' | 'مس و برنج'
  standard: string; equivalent: string; tensile: number; yield: number; hardness: string; densityRatio: number
  pricePerKg: number; machinability: number; weldability: 'عالی' | 'خوب' | 'متوسط' | 'محدود'
  thickness: string; uses: string; mtc: string
}

export const MATERIALS: Material[] = [
  { id: 'st37', name: 'ST37', family: 'فولاد ساختمانی', standard: 'DIN 17100', equivalent: 'S235JR', tensile: 360, yield: 235, hardness: '۱۲۰ HB', densityRatio: 1, pricePerKg: 48000, machinability: 1, weldability: 'عالی', thickness: '۱ تا ۱۰۰', uses: 'شاسی، براکت، صفحه ستون، سازه سبک', mtc: 'فولاد مبارکه / اکسین' },
  { id: 'st52', name: 'ST52', family: 'فولاد ساختمانی', standard: 'DIN 17100', equivalent: 'S355J2', tensile: 510, yield: 355, hardness: '۱۶۰ HB', densityRatio: 1, pricePerKg: 56000, machinability: 1.05, weldability: 'خوب', thickness: '۳ تا ۱۲۰', uses: 'سازه سنگین، جرثقیل، اتصالات بارگیر', mtc: 'اکسین خوزستان' },
  { id: 'ck45', name: 'CK45', family: 'فولاد عملیات‌پذیر', standard: 'DIN 17200', equivalent: 'C45E', tensile: 650, yield: 430, hardness: '۲۰۰ HB', densityRatio: 1, pricePerKg: 72000, machinability: 1.2, weldability: 'متوسط', thickness: 'میلگرد Ø۱۰ تا Ø۳۰۰', uses: 'شفت، پین، چرخ‌دنده سبک', mtc: 'فولاد آلیاژی ایران' },
  { id: 'mo40', name: 'MO40 (42CrMo4)', family: 'فولاد عملیات‌پذیر', standard: 'DIN EN 10083', equivalent: 'AISI 4140', tensile: 1000, yield: 750, hardness: '۳۰ HRC', densityRatio: 1, pricePerKg: 98000, machinability: 1.35, weldability: 'محدود', thickness: 'میلگرد Ø۲۰ تا Ø۴۰۰', uses: 'شفت انتقال قدرت، قطعات تحت ضربه', mtc: 'فولاد آلیاژی ایران' },
  { id: 'hardox450', name: 'Hardox 450', family: 'فولاد ضدسایش', standard: 'SSAB', equivalent: 'AR450', tensile: 1400, yield: 1200, hardness: '۴۵۰ HBW', densityRatio: 1, pricePerKg: 210000, machinability: 1.6, weldability: 'متوسط', thickness: '۳ تا ۸۰', uses: 'لاینر سنگ‌شکن، جام لودر، شوت معدن', mtc: 'SSAB (وارداتی)' },
  { id: 'ss304', name: 'استنلس استیل ۳۰۴', family: 'فولاد زنگ‌نزن', standard: 'ASTM A240', equivalent: '1.4301', tensile: 515, yield: 205, hardness: '۲۰۱ HB', densityRatio: 1.01, pricePerKg: 285000, machinability: 1.4, weldability: 'عالی', thickness: '۰٫۵ تا ۵۰', uses: 'صنایع غذایی، دارویی، تجهیزات بهداشتی', mtc: 'POSCO / Outokumpu' },
  { id: 'ss316', name: 'استنلس استیل ۳۱۶L', family: 'فولاد زنگ‌نزن', standard: 'ASTM A240', equivalent: '1.4404', tensile: 485, yield: 170, hardness: '۲۱۷ HB', densityRatio: 1.02, pricePerKg: 395000, machinability: 1.5, weldability: 'عالی', thickness: '۰٫۵ تا ۴۰', uses: 'پتروشیمی، محیط‌های خورنده و دریایی', mtc: 'Outokumpu' },
  { id: 'al6061', name: 'آلومینیوم 6061-T6', family: 'آلومینیوم', standard: 'ASTM B209', equivalent: 'AlMg1SiCu', tensile: 310, yield: 276, hardness: '۹۵ HB', densityRatio: 0.345, pricePerKg: 330000, machinability: 0.8, weldability: 'خوب', thickness: '۱ تا ۱۵۰', uses: 'فیکسچر، قطعات سبک ماشین‌آلات', mtc: 'المهدی / وارداتی' },
  { id: 'al5083', name: 'آلومینیوم 5083', family: 'آلومینیوم', standard: 'ASTM B209', equivalent: 'AlMg4.5Mn', tensile: 290, yield: 145, hardness: '۷۵ HB', densityRatio: 0.34, pricePerKg: 345000, machinability: 0.85, weldability: 'عالی', thickness: '۲ تا ۸۰', uses: 'بدنه مخازن، صنایع دریایی', mtc: 'وارداتی' },
  { id: 'brass', name: 'برنج CuZn39Pb3', family: 'مس و برنج', standard: 'EN 12164', equivalent: 'C38500', tensile: 430, yield: 250, hardness: '۱۱۰ HB', densityRatio: 1.08, pricePerKg: 520000, machinability: 0.6, weldability: 'محدود', thickness: 'میلگرد Ø۵ تا Ø۱۲۰', uses: 'بوش، اتصالات، قطعات دقیق تراشکاری', mtc: 'شهید باهنر' },
]

export type Process = {
  id: string; name: string; short: string; icon: string; ratePerM: number; setupPerPart: number; setupFixed: number; baseDays: number
  tolerance: string; maxSize: string; machines: string; desc: string
}

export const PROCESSES: Process[] = [
  { id: 'laser', name: 'برش لیزر فایبر', short: 'برش لیزر', icon: 'Zap', ratePerM: 42000, setupPerPart: 25000, setupFixed: 2_500_000, baseDays: 5, tolerance: '±۰٫۱ mm', maxSize: '۳ × ۱۲ متر، تا ۳۰ mm فولاد', machines: 'فایبر ۶ تا ۲۰ کیلووات', desc: 'برش دقیق ورق با لبه تمیز و حداقل ناحیه متاثر از حرارت؛ مناسب براکت، فلنج و صفحات سوراخ‌دار.' },
  { id: 'plasma', name: 'برش پلاسما و هوابرش CNC', short: 'پلاسما', icon: 'Flame', ratePerM: 26000, setupPerPart: 30000, setupFixed: 2_000_000, baseDays: 5, tolerance: '±۰٫۸ mm', maxSize: 'ورق تا ۱۵۰ mm', machines: 'های‌دفینیشن پلاسما، اکسی‌گاز', desc: 'برش اقتصادی ورق‌های ضخیم برای صفحه ستون، لچکی و قطعات سازه‌ای سنگین.' },
  { id: 'bending', name: 'خم‌کاری پرس‌برک CNC', short: 'خم‌کاری', icon: 'CornerDownLeft', ratePerM: 30000, setupPerPart: 40000, setupFixed: 3_000_000, baseDays: 7, tolerance: '±۰٫۵° زاویه', maxSize: 'طول خم تا ۶ متر، ۴۰۰ تن', machines: 'پرس‌برک ۴+۱ محور', desc: 'برش و خم ترکیبی برای کانال، قاب، بدنه تابلو و قطعات ورقی پیچیده.' },
  { id: 'cnc', name: 'ماشین‌کاری CNC (فرز و تراش)', short: 'ماشین‌کاری', icon: 'Cog', ratePerM: 160000, setupPerPart: 180000, setupFixed: 6_000_000, baseDays: 10, tolerance: '±۰٫۰۱ mm (IT7)', maxSize: 'تا ۲۰۰۰ × ۸۰۰ × ۶۰۰ mm', machines: 'فرز ۳ و ۵ محور، تراش CNC', desc: 'قطعات دقیق با تلرانس‌های تنگ؛ شفت، بوش، هوزینگ، قالب و فیکسچر.' },
  { id: 'welding', name: 'جوشکاری تخصصی و مونتاژ', short: 'جوشکاری', icon: 'Sparkles', ratePerM: 85000, setupPerPart: 120000, setupFixed: 4_000_000, baseDays: 12, tolerance: 'طبق AWS D1.1 / WPS', maxSize: 'تا ۱۲ متر', machines: 'MIG/MAG، TIG، زیرپودری', desc: 'جوش با WPS و جوشکار دارای گواهی؛ همراه با تست‌های VT/PT/UT در صورت نیاز.' },
  { id: 'structure', name: 'ساخت سازه و استراکچر', short: 'سازه', icon: 'Building2', ratePerM: 70000, setupPerPart: 300000, setupFixed: 15_000_000, baseDays: 21, tolerance: 'طبق نقشه‌های شاپ', maxSize: 'نامحدود (مونتاژ در محل)', machines: 'سالن ساخت با جرثقیل سقفی', desc: 'اسکلت فلزی، پایپ‌رک، سکو و پلتفرم، شوت و هاپر برای پروژه‌های EPC و معدنی.' },
  { id: 'assembly', name: 'مونتاژ و تجهیزات هیدرولیک/پنوماتیک', short: 'مونتاژ', icon: 'Wrench', ratePerM: 95000, setupPerPart: 250000, setupFixed: 8_000_000, baseDays: 18, tolerance: 'طبق نقشه اسمبلی', maxSize: 'طبق پروژه', machines: 'خط مونتاژ و تست فشار', desc: 'ساخت اسمبلی کامل همراه با تأمین جک، پمپ، شیر و تست عملکردی.' },
]

export const QC_TIERS = [
  { id: 'basic', name: 'پایه', price: 'رایگان', base: 0, items: ['بازرسی ابعادی با کولیس', 'کنترل ظاهری و پلیسه', 'عکس از قطعه نهایی پیش از ارسال'], fit: 'قطعات عمومی و غیرحساس' },
  { id: 'standard', name: 'صنعتی', price: 'از ۳٫۵ میلیون تومان', base: 3_500_000, items: ['آنالیز کوانتومتری متریال', 'گزارش ابعادی مکتوب', 'تطبیق MTC با ذوب متریال', 'بازرسی جوش VT'], fit: 'قطعات ماشین‌آلات و سازه‌های بارگیر' },
  { id: 'advanced', name: 'دقیق و حساس', price: 'از ۱۲ میلیون تومان', base: 12_000_000, items: ['گزارش CMM سه‌بعدی', 'تست غیرمخرب PT / UT', 'تست کشش و سختی', 'بازرسی شخص ثالث (TPI) در کارخانه'], fit: 'نفت، گاز، پتروشیمی، قطعات ایمنی' },
]

export const FINISHES = [
  { id: 'none', name: 'بدون پوشش', pricePerM2: 0 },
  { id: 'sandblast', name: 'سندبلاست SA2.5', pricePerM2: 280000 },
  { id: 'epoxy', name: 'سندبلاست + زینک‌ریچ اپوکسی', pricePerM2: 690000 },
  { id: 'galv', name: 'گالوانیزه گرم', pricePerM2: 820000 },
  { id: 'powder', name: 'رنگ پودری الکترواستاتیک', pricePerM2: 450000 },
  { id: 'blackox', name: 'سیاه‌کاری (Black Oxide)', pricePerM2: 380000 },
]

export const CERTS = [
  { id: 'mtc', name: 'گواهی متریال کارخانه (MTC 3.1)', desc: 'آنالیز شیمیایی و خواص مکانیکی ورق از کارخانه مادر' },
  { id: 'coc', name: 'گواهی انطباق (CoC)', desc: 'تأیید رسمی تطابق قطعه با نقشه و مشخصات' },
  { id: 'trace', name: 'ردیابی متریال', desc: 'شماره ذوب و منبع تأمین روی هر قطعه حک می‌شود' },
  { id: 'wps', name: 'WPS / PQR جوشکاری', desc: 'دستورالعمل و تأیید صلاحیت روش جوشکاری' },
]

export const INDUSTRIES = [
  { name: 'معدن و فرآوری', ex: 'لاینر، شوت، هاپر، قطعات سنگ‌شکن' },
  { name: 'فولاد و ذوب', ex: 'قطعات یدکی خط نورد، غلتک، فیکسچر' },
  { name: 'نفت، گاز و پتروشیمی', ex: 'فلنج، ساپورت لوله، اسکید' },
  { name: 'سیمان', ex: 'بدنه آسیاب، پره فن، داکت' },
  { name: 'ماشین‌سازی', ex: 'شاسی، هوزینگ، شفت، چرخ‌دنده' },
  { name: 'ساختمان و انبوه‌سازی', ex: 'صفحه ستون، اتصالات، نرده و سازه سبک' },
]
