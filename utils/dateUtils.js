export const formatThaiDateTime = (date, type = 'full') => {
  const thaiMonths = [
    'มกราคม', 'กุมภาพันธ์', 'มีนาคม', 'เมษายน', 'พฤษภาคม', 'มิถุนายน',
    'กรกฎาคม', 'สิงหาคม', 'กันยายน', 'ตุลาคม', 'พฤศจิกายน', 'ธันวาคม'
  ];

  const thaiDays = [
    'อาทิตย์', 'จันทร์', 'อังคาร', 'พุธ', 'พฤหัสบดี', 'ศุกร์', 'เสาร์'
  ];

  const formatThaiTime = (hours, minutes) => {
    if (hours === 0) return `เที่ยงคืน${minutes > 0 ? `${minutes} นาที` : ''}`;
    if (hours === 12) return `เที่ยง${minutes > 0 ? `${minutes} นาที` : ''}`;
    
    if (hours > 12) {
      hours -= 12;
      return `บ่าย${hours}${minutes > 0 ? `:${minutes}` : ''} น.`;
    }
    
    return `${hours}:${minutes.toString().padStart(2, '0')} น.`;
  };

  const d = new Date(date);
  const day = d.getDay();
  const date_num = d.getDate();
  const month = d.getMonth();
  const year = d.getFullYear() + 543; // แปลงเป็นปี พ.ศ.
  const hours = d.getHours();
  const minutes = d.getMinutes();

  switch(type) {
    case 'date':
      return `วัน${thaiDays[day]}ที่ ${date_num} ${thaiMonths[month]} ${year}`;
    case 'time':
      return formatThaiTime(hours, minutes);
    case 'full':
      return `วัน${thaiDays[day]}ที่ ${date_num} ${thaiMonths[month]} ${year} ${formatThaiTime(hours, minutes)}`;
    default:
      return date.toLocaleString('th-TH');
  }
};

export const compareDateTime = (date1, date2) => {
  const d1 = new Date(date1);
  const d2 = new Date(date2);
  return d1.getTime() - d2.getTime();
};

export const isValidTrainingTime = (dateTime) => {
  const now = new Date();
  const trainingTime = new Date(dateTime);
  
  // ต้องเป็นเวลาในอนาคตอย่างน้อย 1 ชั่วโมง
  return trainingTime.getTime() - now.getTime() >= 60 * 60 * 1000;
};
