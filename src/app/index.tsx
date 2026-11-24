import { useEffect, useState } from 'react';
import { ScrollView, Text, View } from 'react-native';
import { supabase } from '../lib/supabase';

export default function ConnectionTest() {
  const [rows, setRows] = useState<string[] | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    (async () => {
      const [p, s, d] = await Promise.all([
        supabase.from('programmes').select('id', { count: 'exact', head: true }),
        supabase.from('sermons').select('id', { count: 'exact', head: true }),
        supabase
          .from('devotionals')
          .select('title, publish_date')
          .order('publish_date', { ascending: false })
          .limit(1),
      ]);
      const err = p.error || s.error || d.error;
      if (err) {
        setError(err.message);
        return;
      }
      setRows([
        'Programmes visible: ' + p.count,
        'Sermons visible: ' + s.count,
        'Latest devotional: ' + (d.data?.[0]?.title ?? 'none'),
      ]);
    })();
  }, []);

  return (
    <ScrollView style={{ flex: 1, backgroundColor: '#1B2A4A' }}>
      <View style={{ padding: 24, paddingTop: 80 }}>
        <Text style={{ color: '#D4AF37', fontSize: 28, fontWeight: '700' }}>
          TSC Official
        </Text>
        <Text style={{ color: '#F7F9FA', marginTop: 8 }}>Connection test</Text>
        {error && (
          <Text style={{ color: '#ff8080', marginTop: 24 }}>Error: {error}</Text>
        )}
        {!rows && !error && (
          <Text style={{ color: '#F7F9FA', marginTop: 24 }}>Connecting...</Text>
        )}
        {rows?.map((r) => (
          <Text key={r} style={{ color: '#F7F9FA', fontSize: 18, marginTop: 16 }}>
            {r}
          </Text>
        ))}
      </View>
    </ScrollView>
  );
}
