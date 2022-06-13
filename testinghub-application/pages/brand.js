import Header from "../components/Header";
import Layout from "../components/Layout";
import Footer from "../components/Footer";

const Brand = () => {
  return (
    <Layout pageTitle="Brands Page">
      <Header />
      <div className="center">
        <br></br>
        <h2>Enough with the hours of spreadsheets. </h2>
        <h3>
          Let TestingHub drive data-driven decisions to free up your marketing
          team to grow towards your goals.
        </h3>
        <br></br>
        <h4>DATA FOR ECOMMERCE</h4>

        <p>
          Navigating through eCom marketing as a sole brand is tough. With only
          one viewpoint, it can be hard to stay ahead of the game.
          <br></br>TestingHub makes it easy to keep a birds eye view on all of
          your A/B testing data so you don’t miss a beat.
        </p>

        <br></br>
        <h4>RELIABLE & CONSISTENT</h4>

        <p>
          Balls get dropped. Nobody is checking A/B subject line tests during
          BFCM – we get it.
          <br></br>That’s why <strong>We</strong> do it.{" "}
          <strong>Every day. 24/7. </strong>
          <br></br>A constant analyst to give your business the analytical edge
          it needs in today’s marketplace.
        </p>
      </div>

      <hr></hr>
      <Footer />
    </Layout>
  );
};

export default Brand;
