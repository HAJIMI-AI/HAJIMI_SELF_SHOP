import { LanguageProvider } from "@/i18n/LanguageContext";
import AppStore from "@/components/AppStore";

function App() {
  return (
    <LanguageProvider>
      <AppStore />
    </LanguageProvider>
  );
}

export default App;
