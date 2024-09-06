


import React, { useState, useEffect } from 'react';
import axios from 'axios';
import SwapHorizIcon from '@material-ui/icons/SwapHoriz';





function CurrencyConverter () {
  const [amount, setAmount] = useState(0);
  const [baseCurrency, setBaseCurrency] = useState('USD');
  const [targetCurrency, setTargetCurrency] = useState('EUR');
  const [conversionRate, setConversionRate] = useState(0);
  const [conversionResult, setConversionResult] = useState(0);
  const [currencies, setCurrencies] = useState([]);
  const [fetchingData, setFetchingData] = useState(false);



  useEffect(() => {
    
    axios
      .get(`https://v6.exchangerate-api.com/v6/0c625f7a785fefd83cdba653/latest/USD`)
      .then((response) => {
        setCurrencies(Object.keys(response.data.conversion_rates));
      })
      .catch((error) => {
        console.log(error);
      });
  }, []);

  const handleGetExchange = () => {
    setFetchingData(true);
    axios
      .get(
        `https://v6.exchangerate-api.com/v6/0c625f7a785fefd83cdba653/pair/${baseCurrency}/${targetCurrency}/${amount}`
      )
      .then((response) => {
        setConversionRate(response.data.conversion_rate);
        setConversionResult(amount * response.data.conversion_rate);
        setFetchingData(false);
      })
      .catch((error) => {
        console.log(error);
        setFetchingData(false);
      });
  };

  const swap=()=>{
    const temp=baseCurrency;
    setBaseCurrency(targetCurrency);
    setTargetCurrency(temp);

    setConversionResult(conversionResult/conversionRate);
    setConversionRate(1/conversionRate)
  }

 

  return (
    <div className="card">
      <h2>Currency Converter</h2>
      <div className="form">
        <label>Amount:</label>
        <input
          type="number"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
        />
      </div>
      <div className="drop-list">
        <label>From:</label>
        <select
          value={baseCurrency}
          onChange={(e) => setBaseCurrency(e.target.value)}
        >
          {currencies.map((currency) => (
            <option key={currency} value={currency}>
              {currency}
            </option>
          ))}
        </select>

        <button className='icon' onClick={swap}>
          <SwapHorizIcon/>
        </button>
        
      
        <label>To:</label>
        <select
          value={targetCurrency}
          onChange={(e) => setTargetCurrency(e.target.value)}
        >
          {currencies.map((currency) => (
            <option key={currency} value={currency}>
              {currency}
            </option>
          ))}
        </select>
        
      </div>
      
      {fetchingData ? (
        <p>Loading...</p>
      ) : (
        <div className="exchange-result">
          <p>
            Conversion Rate: {baseCurrency}/{targetCurrency} ={' '}
            {conversionRate.toFixed()}
          </p>
          <p>
            Result: {amount} {baseCurrency} = {amount*conversionResult.toFixed(2)}{' '}
            {targetCurrency}
          </p>
          
        </div>
        
      )}
      <div className='button'>
      <button onClick={handleGetExchange} disabled={fetchingData}>
        Get Exchange
      </button>
      </div>
    </div>
  );
}

export default CurrencyConverter;