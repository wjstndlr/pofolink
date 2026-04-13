export function slugify(text: string): string {
  return text
    .toLowerCase()
    .trim()
    // 특수문자 제거 (한글, 영문, 숫자, 하이픈, 공백은 유지)
    .replace(/[^\w\s\u3131-\u318E\uAC00-\uD7A3-]/g, "")
    // 공백/언더스코어를 하이픈으로
    .replace(/[\s_]+/g, "-")
    // 연속 하이픈 제거
    .replace(/-+/g, "-")
    // 앞뒤 하이픈 제거
    .replace(/^-+|-+$/g, "")
    .slice(0, 80);
}
