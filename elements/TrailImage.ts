import { div, button } from "../helpers";
import { styled } from "../styles";

const Wrapper = styled(div)`
  background-color: black;
  background-size: cover;
  background-position: 50% 50%;
  padding-top: 60%;
  position: relative;

  &[data-open="true"] {
    background-image: none !important;

    [data-credit] {
      display: block;
    }
  }
`;

const WrapperImmersive = styled(Wrapper)`
  padding-top: 140%;

  @media (min-width: 600px) {
    padding-top: 100%;
  }

  @media (min-width: 900px) {
    padding-top: 100vh;
  }
`;

const CreditText = styled(div)`
  display: none;
  position: absolute;
  color: white;
  top: 0;
  width: 100%;
  padding: 16px;
`;

const Toggle = styled(button)`
  appearance: none;
  background-color: ${theme => theme.main}
  border: none;
  border-radius: 100%;
  color: white;
  display: block;
  width: 40px;
  height: 40px;
  line-height: 20px;
  vertical-align: middle;
  text-align: center;
  position: absolute;
  bottom: 16px;
  right: 16px;
  z-index: 1;
`;

const TrailImage = ({
  src,
  credit,
  immersive = false
}: {
  src: string;
  credit: string;
  immersive?: boolean;
}) =>
  (immersive ? WrapperImmersive : Wrapper).attrs({
    id: "trail-wrapper",
    "data-open": false,
    style: { backgroundImage: `url(${src})` }
  })(
    CreditText.attrs({ "data-credit": true })(credit),
    Toggle.attrs({
      onclick:
        "this.parentNode.dataset.open = !JSON.parse(this.parentNode.dataset.open)"
    })("")
  );

export { TrailImage };
