/**
 * Calculates detailed age from birth date
 * Returns format: "X months, Y weeks" or "X months, Y days"
 */
export function calculateDetailedAge(birthDate: string): string {
  const birth = new Date(birthDate);
  const now = new Date();
  
  let years = now.getFullYear() - birth.getFullYear();
  let months = now.getMonth() - birth.getMonth();
  let days = now.getDate() - birth.getDate();
  
  // Adjust for negative days
  if (days < 0) {
    months--;
    const lastMonth = new Date(now.getFullYear(), now.getMonth(), 0);
    days += lastMonth.getDate();
  }
  
  // Adjust for negative months
  if (months < 0) {
    years--;
    months += 12;
  }
  
  // Calculate weeks from remaining days
  const weeks = Math.floor(days / 7);
  const remainingDays = days % 7;
  
  // Build the age string
  const parts: string[] = [];
  
  if (years > 0) {
    parts.push(`${years} ${years === 1 ? 'year' : 'years'}`);
  }
  
  if (months > 0) {
    parts.push(`${months} ${months === 1 ? 'month' : 'months'}`);
  }
  
  if (weeks > 0 && years === 0) {
    parts.push(`${weeks} ${weeks === 1 ? 'week' : 'weeks'}`);
  }
  
  if (remainingDays > 0 && years === 0 && months < 2) {
    parts.push(`${remainingDays} ${remainingDays === 1 ? 'day' : 'days'}`);
  }
  
  // If baby is less than a month old
  if (months === 0 && years === 0) {
    if (weeks > 0) {
      return `${weeks} ${weeks === 1 ? 'week' : 'weeks'}`;
    }
    return `${days} ${days === 1 ? 'day' : 'days'}`;
  }
  
  return parts.join(', ') || '0 days';
}

/**
 * Gets the main age display (e.g., "5 Months")
 */
export function getMainAge(birthDate: string): string {
  const birth = new Date(birthDate);
  const now = new Date();
  
  let years = now.getFullYear() - birth.getFullYear();
  let months = now.getMonth() - birth.getMonth();
  
  if (months < 0) {
    years--;
    months += 12;
  }
  
  if (years > 0) {
    return `${years} ${years === 1 ? 'Year' : 'Years'}`;
  }
  
  if (months > 0) {
    return `${months} ${months === 1 ? 'Month' : 'Months'}`;
  }
  
  // Less than a month
  const days = Math.floor((now.getTime() - birth.getTime()) / (1000 * 60 * 60 * 24));
  return `${days} ${days === 1 ? 'Day' : 'Days'}`;
}

/**
 * Gets the remaining days in current month/period for subtext
 */
export function getRemainingDays(birthDate: string): number {
  const birth = new Date(birthDate);
  const now = new Date();
  
  // Calculate total days since birth
  const diffTime = now.getTime() - birth.getTime();
  const totalDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
  
  // Get days remaining in current month period
  const birthDay = birth.getDate();
  const currentDay = now.getDate();
  
  // Days since the birth day of current month
  if (currentDay >= birthDay) {
    return currentDay - birthDay;
  } else {
    // If we haven't reached birth day this month, calculate from last month
    const lastMonth = new Date(now.getFullYear(), now.getMonth() - 1, birthDay);
    const daysSinceLastBirthDay = Math.floor((now.getTime() - lastMonth.getTime()) / (1000 * 60 * 60 * 24));
    return daysSinceLastBirthDay;
  }
}

