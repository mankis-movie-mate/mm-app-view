export function parseMongoId(_id?: { $oid?: string } | string): string {
  if (!_id) return '';
  if (typeof _id === 'string') return _id;
  return _id.$oid || '';
}

export function parseMongoDate(d?: { $date?: string } | string): string {
  if (!d) return '';
  if (typeof d === 'string') return d;
  return new Date(d.$date!).toISOString();
}

