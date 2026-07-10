// src/pages/MonoWall.jsx
import { PRODUCTS } from "./Products/productData";
import ProductHero from "./Products/ProductHero";
import ProductDetails from "./Products/ProductDetails";
import KeyPerformance from "./Products/KeyPerformance";
import AvailableJoints from "./Products/AvailableJoints";
import Accessories from "./Products/Accessories";
import ProductFAQ from "./Products/ProductFAQ";

const MonoWall = () => {
  const product = PRODUCTS.monoWall;
  return (
    <>
      <div className="w-full bg-white">
        <ProductHero product={product} />
        <ProductDetails product={product} />
        <KeyPerformance product={product} />
        <AvailableJoints product={product} />
        <Accessories product={product} />
        <ProductFAQ product={product} />
      </div>
    </>
  );
};

export default MonoWall;
