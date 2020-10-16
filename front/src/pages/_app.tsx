import { CSSReset, ThemeProvider } from "@chakra-ui/core";
import theme from "../theme";

import { localStateContext } from "../state/context";
import INITIAL_STATE, { LocalState } from "../state/initialState";
import { Component } from "react";
import KeyManager, { KeyComboHandler, KeyEventKind, KEYUP_AND_KEYDOWN_OPTIONS } from "../common/KeyManager";
import { Layout } from "../components/Layout";
import withApollo from "../utils/withApollo";

import "katex/dist/katex.min.css";
import "../styles.scss";

const StateContext = localStateContext();

interface IAppProps {
  Component: any;
  pageProps: any;
}

class App extends Component<IAppProps, LocalState> {
  constructor(props: IAppProps) {
    super(props);
    this.state = INITIAL_STATE;
  }

  subscription: null | number = null;

  setIsActivationChordPressed: KeyComboHandler = (keyData) => {
    this.setState({
      isActivationChordPressed: keyData.kind === KeyEventKind.KeyDown,
    });
  }

  componentDidMount() {
    this.subscription = KeyManager.subscribe(
      this.state.activationChord.join(","), this.setIsActivationChordPressed, KEYUP_AND_KEYDOWN_OPTIONS);
  }

  componentWillMount() {
    if (this.subscription !== null) KeyManager.unsubscribe(this.subscription);
  }

  render() {
    const Component = this.props.Component;

    return (
      <StateContext.Provider value={this.state}>
        <ThemeProvider theme={theme}>
          <CSSReset />
          <Layout>
            <Component {...this.props.pageProps} />
          </Layout>
        </ThemeProvider>
      </StateContext.Provider>
    );
  }
}

export default withApollo(App);