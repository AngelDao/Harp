import logo from "./logo.svg";
import "./App.css";

function App() {
  return (
    <div class="container">
      <section>
        <div class="container-box">
          <div class="logo">
            <img src="./assets/harp.png" alt="" />
          </div>
          <div
            style={{ marginTop: "0px", marginBottom: "1.5px" }}
            class="border"
          ></div>
        </div>
      </section>
      <section>
        <h1 class="heading">Purpose</h1>
        <div class="container-box">
          <div class="why-we-build-harp">
            <div class="border"></div>
            <p>
              Harp is a decentralized{" "}
              <a href="https://www.liquity.org" target="_blank">
                Liquity
              </a>{" "}
              Frontend. We are very strong supporters of the Liquity Protocol
              and believe deeply that decentralized financial products are
              critical to insure the future is more fair, free, and open! For
              these reasons we have developed Harp, and plan to maintain it, to
              be{" "}
              <a href="https://github.com/AngelDao/harp" target="_blank">
                open source
              </a>{" "}
              and to offer added incentives for Liquity Protocol interactions
            </p>
            <div class="border"></div>
          </div>
        </div>
      </section>
      <section>
        <h1 class="heading">Instances</h1>
        <div class="container-box">
          <div
            class="border"
            style={{ marginTop: "0px", marginBottom: "12.5px" }}
          ></div>
          <div class="app">
            <a class="btn" href="https://app.harp.finance/" target="_blank">
              Web
            </a>
            <a
              class="btn"
              href="https://ipfs.io/ipns/k51qzi5uqu5dljvgw06ntmnwx8lhns6ypl5kwj2pt6p321lw1uy30a60o8t3zv/"
              target="_blank"
            >
              IPFS
            </a>
            <a
              class="btn"
              href="http://harp2nhtexkbu2neaf5dbpzg2hhdhz3cxdddgg6ewwq7ca3ie7nr57id.onion/"
              target="_blank"
            >
              TOR
            </a>
          </div>
          <div
            class="border"
            style={{ marginTop: "12.5px", marginBottom: "0px" }}
          ></div>
        </div>
      </section>
      <section>
        <h1 class="heading">Docs</h1>
        <div class="container-box">
          <div
            class="border"
            style={{ marginTop: "0px", marginBottom: "12.5px" }}
          ></div>
          <div class="docs">
            <div class="row" style={{ marginBottom: "7px" }}>
              <a href="https://docs.harp.finance" target="_blank">
                Docs
              </a>
              <a href="https://github.com/AngelDao/harp" target="_blank">
                GitHub
              </a>
              <a
                href="https://github.com/AngelDao/harp/tree/master/contract-testing"
                target="_blank"
              >
                Contracts
              </a>
            </div>
            <div class="row" style={{ marginTop: "7px" }}>
              <a href="">Uniswap</a>
              <a href="https://github.com/liquity/" target="_blank">
                Liquity GitHub
              </a>
              <a href="https://docs.liquity.org" target="_blank">
                Liquity Docs
              </a>
            </div>
          </div>
          <div
            class="border"
            style={{ marginTop: "12.5px", marginBottom: "0px" }}
          ></div>
        </div>
      </section>
      <section>
        <div class="connnect">
          <a href="https://discord.gg/KBeR8sKt5R" target="_blank">
            Discord
          </a>
          <a href="https://twitter.com/HarpFinance" target="_blank">
            Twitter
          </a>
          <a href="https://t.me/joinchat/OARFns4AUNgzM2Ux" target="_blank">
            Telegram
          </a>
        </div>
      </section>
    </div>
  );
}

export default App;
