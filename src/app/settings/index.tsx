import { Divider } from "react-native-paper";
import { Container } from "~/components/Container";
import { ScreenContent } from "~/components/ScreenContent";
import { HeaderScreen } from "~/components/ScreenHeader";
import ScrollContent from "~/components/ScrollContent";
import Categories from "./Categories";
import MeasuredUnits from "./MeasuredUnits";
import ThemeOptions from "./ThemeOptions";

export default function Settings() {
  return (
    <>
      <ScrollContent>
        <HeaderScreen title="Configurações" />
        <Divider />

        <Container>
          <ScreenContent>
            <ThemeOptions />
            <Divider />
            <Categories />
            <Divider />
            <MeasuredUnits />
          </ScreenContent>
        </Container>
      </ScrollContent>
    </>
  );
}
