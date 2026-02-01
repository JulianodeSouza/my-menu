import { Divider } from "react-native-paper";
import { Container } from "~/components/Container";
import { ScreenContent } from "~/components/ScreenContent";
import { HeaderScreen } from "~/components/ScreenHeader";
import ScrollContent from "~/components/ScrollContent";
import Categories from "./Categories";
import ThemeOptions from "./ThemeOptions";

export default function Settings() {
  return (
    <>
      <HeaderScreen title="Configurações" />
      <Divider />
      <ScrollContent>
        <Container>
          <ScreenContent>
            <ThemeOptions />
            <Divider />
            <Categories />
          </ScreenContent>
        </Container>
      </ScrollContent>
    </>
  );
}
