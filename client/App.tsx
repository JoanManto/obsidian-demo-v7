import { React, ObsidianWrapper } from "../deps/deps.client.ts";
import Home from "./components/Home.tsx";

const App = (props: any) => {
  return (
    <ObsidianWrapper algo='W-TinyLFU'>
      <Home />
    </ObsidianWrapper>
  );
}

export default App;
