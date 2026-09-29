export type ExampleQuestion = {
  text: string;
  image: string;
  alt: string;
};

export const EXAMPLE_QUESTIONS: readonly ExampleQuestion[] = [
  {
    text: "I’ve just started self-employment. What do I need to register for?",
    image: "/examples/self-employed.jpg",
    alt: "A woman arranging handmade mugs in her small high street shop",
  },
  {
    text: "How do I apply for a National Insurance number?",
    image: "/examples/ni-number.jpg",
    alt: "A young man reading a letter at his kitchen table beside a laptop",
  },
  {
    text: "Do I need to tell DVLA if I move house?",
    image: "/examples/moving-house.jpg",
    alt: "A couple unloading moving boxes from a car outside a terraced house",
  },
  {
    text: "Can I get help with childcare costs?",
    image: "/examples/childcare.jpg",
    alt: "A father walking hand in hand with his toddler along a leafy street",
  },
  {
    text: "How do I renew my passport?",
    image: "/examples/passport.jpg",
    alt: "A woman with a small suitcase sitting on a seafront bench",
  },
  {
    text: "What help can I get with my energy bills?",
    image: "/examples/energy-bills.jpg",
    alt: "An older man holding a warm drink in his living room by a radiator",
  },
];
