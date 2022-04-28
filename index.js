const axios = require("axios");

const urlWithData = "https://www.monogo.pl/competition/input.txt";
const Monogo = "Monogo";

const makeTitle = (txt) => {
  console.log("\n************************************************");
  console.log(txt);
  console.log("************************************************");
};

const getLastPartOfTask = (minMax) => {
  minMaxMultiplied = (minMax.min * minMax.max).toFixed(0);

  makeTitle("liczba otrzymana z pomnozenia minimalnej i maksymalnej wartosci po zaokragleniu");
  console.log(minMaxMultiplied);

  const chunksFromNumber = [];
  const chunkSize = 2;
  for (let i = 0; i < minMaxMultiplied.length; i += chunkSize) {
    const chunk = minMaxMultiplied.slice(i, i + chunkSize);
    chunksFromNumber.push(chunk);
  }

  SumNumbersArray = chunksFromNumber.map((chunk) => {
    return parseInt(chunk[0]) + parseInt(chunk[1]);
  });

  makeTitle("tablice otrzymana z mnozenia czesci liczby podzielonej na 'chunki'");
  console.log(SumNumbersArray);

  // monogo office:
  // ul. Nałęczowska 14 p.10
  const indexOfMonogoOffice = SumNumbersArray.findIndex((n) => n === 14);

  const result = indexOfMonogoOffice * minMaxMultiplied * Monogo.length;

  makeTitle("Wynik ostateczny");
  console.log(result);
};

// reponsible for this part of task:
// Następnie należy uzyskać wartość poprzez pomnożenie najniższej i najwyższej ceny z przefiltrowanej
// listy produktów. Wynik należy sformatować tak, aby był liczbą całkowitą (zaokrągloną,
// bez części ułamkowej).
const getMinMaxVals = (filteredProducts) => {
  const onlyPricesArray = filteredProducts.map(({ price }) => price);

  const minimalPrice = Math.min.apply(Math, onlyPricesArray);
  const maximalPrice = Math.max.apply(Math, onlyPricesArray);

  makeTitle("minimalna i maksymalna cena z przefiltrowanych przed zaokraglaniem");
  console.log(minimalPrice, maximalPrice);

  return {
    min: minimalPrice,
    max: maximalPrice,
  };
};

// reponsible for this part of task:
// "Następnie należy odfiltrować zgrupowane produkty, aby dopasować je do
// wybranych filtrów i uzyskać tylko te produkty, których cena jest wyższa niż 200 (x > 200)."
const getFilteredProducts = (data, filters) => {
  const { colors, sizes } = filters;

  const filteredProducts = data.filter((product) => {
    const { color, size, price } = product;
    return colors.includes(color) && sizes.includes(size) && price > 200;
  });
  console.log("****************");
  console.log("dopasowane do wybranych filtrow z cena wieksza niz 200");
  console.log("****************");
  console.log(filteredProducts);

  const minMax = getMinMaxVals(filteredProducts);
  getLastPartOfTask(minMax);
};

const prepareGroupedData = (data) => {
  const { products, colors, sizes, selectedFilters } = data;
  const groupedData = products.map(({ id, price }) => {
    // there was nothing in task about, however there should be a handler to check if filtering found proper object
    // and if not, propably remove the products from listing (or have some warning about missing data)
    const colorFiltered = colors.filter((color) => color.id === id)[0];
    const sizeFiltered = sizes.filter(
      (size) => parseInt(size.id, 10) === id
    )[0];

    return {
      id,
      price,
      color: colorFiltered.value,
      size: sizeFiltered.value,
    };
  });

  getFilteredProducts(groupedData, selectedFilters);
};

const handleDataGet = (resp) => {
  const { data } = resp;
  prepareGroupedData(data);
};

const handleDataGetError = (e) => {
  console.error("Error getting the data from monogo", e);
};

axios.get(urlWithData).then(handleDataGet).catch(handleDataGetError);
