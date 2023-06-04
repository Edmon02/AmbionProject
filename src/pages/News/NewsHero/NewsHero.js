import React, { useState } from "react";
import { hero } from "../../../dummyData";
import "./NewsHero.css";
import Card from "./Card";

const NewsHero = () => {
  const [items, setIems] = useState(hero);

  return (
    <>
      <section className="hero">
        <div className="container">
          {items.map((item) => {
            return (
              <>
                <Card key={item.id} item={item} />
              </>
            );
          })}
        </div>
      </section>
    </>
  );
};

export default NewsHero;
