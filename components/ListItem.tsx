import { View, Text } from 'react-native';
import { colors, spacing, radii } from '@/constants/theme';

type Props = {
  title: string;
  subtitle?: string;
};

export function ListItem({ title, subtitle }: Props) {
  return (
    <View style={{ paddingVertical: spacing.sm, borderBottomWidth: 1, borderColor: colors.border }}>
      <Text style={{ fontWeight: '700', color: colors.text, fontSize: 16 }}>{title}</Text>
      {subtitle ? (
        <Text style={{ color: colors.textSecondary, marginTop: 2 }}>{subtitle}</Text>
      ) : null}
    </View>
  );
}


