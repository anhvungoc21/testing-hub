import Header from "../components/Header";
import Layout from "../components/Layout";
import Footer2 from "../components/Footer2";

const Agency = () => {
  return (
    <div className="center">
      <Layout pageTitle="Agencies Page">
        <Header />
        <br></br>
        <h2>
          With experience working at competitive eCommerce marketing agencies,{" "}
          <br></br>We shaped TestingHub with agency life in mind:
        </h2>

        <hr></hr>

        <h4>
          <li>EFFICIENCY AT SCALE</li>
        </h4>

        <p>
          Whether managing five brands or fifty, efficiency is the name of the
          game for eCommerce agencies.
          <br></br>
          <strong>Five hours</strong> spent checking A/B tests is five hours
          lost onboarding your next client, meeting with the team or cranking
          out a fire design.
          <br></br>To run, maintain, and update comprehensive A/B testing on an
          email account means at least an hour per month of checking.
          <br></br>Are most agencies doing this? Not yet.
          <br></br>TestingHub sets you ahead of the curve with efficiency to
          deliver for your clients without sacrificing your time.
          <br></br>Feel its benefits multiply as your agency grows.
        </p>

        <br></br>
        <h4>
          <li>TOP LEVEL LEARNINGS & TRENDS</li>
        </h4>

        <p>
          Customers pay for your expertise and your insights from managing ten
          brands.
          <br></br>Imagine an interested brand asked you “What trends are you
          all seeing in copy and customer behavior in the past couple of weeks”?
          <br></br>They’re not asking for which subject line one on that account
          you were just in. They want the big picture – and you should too!
          That’s the beauty of working with as many brands as you do.
          <br></br>TestingHub makes that easy. One account for all managed
          brands. Toggle between brands easily to get the big picture and
          centralize your learnings.{" "}
        </p>

        <br></br>

        <h4>
          <li>DATA DRIVEN DECISIONS AT SCALE</li>
        </h4>

        <p>
          Are your strategies and refinements truly based on data, or are you
          still basing your judgment on “best practices” from the last guru’s
          course you took?
          <br></br>For many agency owners, the commotion of keeping the ship
          upright means we fall in the first bucket.
          <br></br>
          <strong>TestingHub</strong> changes that without steering you off
          course. Data-driven decisions made for your team, you just have to
          execute.
        </p>

        <hr></hr>
        <Footer2 />
      </Layout>
    </div>
  );
};

export default Agency;
