import { useEffect, useMemo, useState } from "react";
import { StyleSheet, View } from "react-native";
import { borderRadius, fontWeights, spacing, typography } from "theme";
import { useApi } from "~/ApiContext";
import Icon from "~/components/Icon";
import { TextComponent } from "~/components/Text";
import { useTheme } from "~/contexts/ThemeContext";

interface CategorieProps {
  id: number;
  name: string;
  icon: string;
}

export default function Categories() {
  const { theme } = useTheme();
  const { getApi } = useApi();
  const [categories, setCategories] = useState<Array<CategorieProps>>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadCategories = async () => {
      const result = await getApi("categories");
      setCategories(result);
    };

    if (loading) {
      setLoading(false);
      loadCategories();
    }
  }, [loading]);

  const headerIconStyle = useMemo(
    () => ({
      backgroundColor: theme.primaryOpacity10,
      padding: spacing.sm,
      borderRadius: borderRadius.xl,
    }),
    [theme.primaryOpacity10]
  );

  return (
    <>
      <View style={styles.container}>
        <View style={styles.titleContainer}>
          <View style={headerIconStyle}>
            <Icon name="Tag" color={theme.primary} />
          </View>
          <View>
            <TextComponent style={styles.title}>Categorias</TextComponent>
            <TextComponent style={styles.subtitle}>Organize seus produtos</TextComponent>
          </View>
        </View>
        <View style={styles.listContainer}>
          <View style={{ flex: 1 }}>
            <TextComponent style={styles.title}>Categorias</TextComponent>
            <TextComponent style={styles.subtitle}>{categories.length} categorias</TextComponent>

            {categories.map((categorie) => (
              <ListCategories key={categorie.id} {...categorie} />
            ))}
          </View>
        </View>
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: spacing.lg,
    marginVertical: spacing.lg,
  },
  titleContainer: {
    flexDirection: "row",
    gap: spacing.md,
    alignItems: "center",
  },
  title: {
    fontSize: typography.fontSizeLg,
    fontWeight: fontWeights.bold,
  },
  subtitle: {
    fontSize: typography.fontSizeSm,
    opacity: 0.7,
  },
  listContainer: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: spacing.xs,
  },
});

function ListCategories(categorie: CategorieProps, deleteCategorie?: () => void) {
  const { theme } = useTheme();
  return (
    <View
      style={[stylesList.container, { borderColor: theme.border, backgroundColor: theme.card }]}>
      <View style={{ flexDirection: "row", alignItems: "center", gap: spacing.md }}>
        <Icon name={categorie.icon ? categorie.icon : "Tag"} color={theme.primary} />
        <TextComponent
          style={{ fontSize: typography.fontSizeBase, fontWeight: fontWeights.medium }}>
          {categorie.name}
        </TextComponent>
      </View>
    </View>
  );
}

const stylesList = StyleSheet.create({
  container: {
    width: "100%",
    display: "flex",
    alignItems: "center",
    flexDirection: "row",
    marginVertical: spacing.sm,
    padding: spacing.md,
    borderRadius: borderRadius.sm,
    borderWidth: 1,
  },
});
