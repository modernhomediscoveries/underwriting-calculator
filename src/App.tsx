import { useState, useEffect } from "react";
import "./App.css";

import { Input } from "./components/ui/input";
import { Slider } from "./components/ui/slider";
function App() {
  const initialData = {
    units: [16],
    marketRent: [2000],
    otherIncome: [3.25],
    occupancy: [90],
    expenses: [40],
    capRate: [6],
  };
  const [formData, setFormData] = useState(initialData);
  const [valueIncrease, setValueIncrease] = useState<{
    netOperatingIncome: number;
    priceToOffer: string | number;
  }>({
    netOperatingIncome: 0,
    priceToOffer: 0,
  });

  useEffect(() => {
    let currentDocumentHeight = 0;

    const sendMessageUpdatingHeight = (height: number) => {
      window.parent.postMessage(
        { eventName: "SET_HEIGHT", payload: { height } },
        "*"
      );
    };

    const handleDocumentMutation = () => {
      const documentHeight = document.body.scrollHeight;

      if (documentHeight && documentHeight !== currentDocumentHeight) {
        currentDocumentHeight = documentHeight;
        console.log(documentHeight);
        sendMessageUpdatingHeight(documentHeight);
      }
    };

    const observer = new MutationObserver(handleDocumentMutation);

    observer.observe(document.body, {
      subtree: true,
      attributes: true,
      childList: true,
      characterData: true,
    });

    setTimeout(() => {
      const documentHeight = document.body.scrollHeight;
      sendMessageUpdatingHeight(documentHeight);
    }, 1000);
  }, []);

  useEffect(() => {
    const unitValue = formData?.units[0] || 0;
    const marketRent = formData?.marketRent[0] || 0;
    const otherIncome = formData?.otherIncome[0] || 0;
    const occupancy = formData?.occupancy[0] || 0;
    const expenses = formData?.expenses[0] || 0;
    const capRate = formData?.capRate[0] || 0;

    const netOperatingIncome =
      unitValue *
      marketRent *
      12 *
      (occupancy / 100) *
      (1 + otherIncome / 100) *
      (1 - expenses / 100);
    const priceToOffer =
      capRate == 0 ? "∞" : Math.round(netOperatingIncome / (capRate / 100));
    setValueIncrease({
      netOperatingIncome: Math.round(netOperatingIncome),
      priceToOffer,
    });
  }, [formData]);

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: [Number(value) > 0 ? parseFloat(value) : 0],
    }));
  }

  return (
    <div className="grid md:grid-cols-2 w-[1200px] max-w-full mx-auto">
      <form className="bg-white p-5 rounded-t-[15px] md:rounded-none md:rounded-l-[15px]">
        <div className="">
          <div className="flex justify-between items-center mb-4">
            <p className="text-lg font-semibold">Number of units:</p>
            <div className="relative">
              <Input
                name="units"
                value={formData.units[0]}
                onChange={handleChange}
              />
              <p className="text-gray-400 font-light  absolute right-2 top-1/2  transform -translate-y-1/2">
                Unit
              </p>
            </div>
          </div>
          <Slider
            name="units"
            onValueChange={(value: number[]) =>
              setFormData({ ...formData, units: value })
            }
            value={[Number(formData.units)]}
            defaultValue={[Number(formData.units)]}
            max={500}
            min={1}
            step={1}
          />
          <p className="text-start mt-2">
            Enter the total number of units in the property
          </p>
        </div>

        {/* 2 */}
        <hr className="my-3" />
        <div className="">
          <div className="flex justify-between items-center mb-4">
            <p className="text-lg font-semibold">Market Rent:</p>
            <div className="relative">
              <Input
                name="marketRent"
                value={formData.marketRent[0]}
                onChange={handleChange}
              />
              <p className="text-gray-400 font-light  absolute right-2 top-1/2  transform -translate-y-1/2">
                USD
              </p>
            </div>
          </div>
          <Slider
            name="marketRent"
            onValueChange={(value: number[]) =>
              setFormData({ ...formData, marketRent: value })
            }
            value={[Number(formData.marketRent)]}
            defaultValue={[Number(formData.marketRent)]}
            max={2000}
            min={1}
            step={25}
          />
          <p className="text-start mt-2">
            Enter fair market rent/month charged for this type of property
          </p>
        </div>

        {/* 3 */}
        <hr className="my-3" />
        <div className="">
          <div className="flex justify-between items-center mb-4">
            <p className="text-lg font-semibold">Other Income:</p>
            <div className="relative">
              <Input
                name="otherIncome"
                value={formData.otherIncome[0]}
                onChange={handleChange}
              />
              <p className="text-gray-400 font-light  absolute right-2 top-1/2  transform -translate-y-1/2">
                %
              </p>
            </div>
          </div>
          <Slider
            name="otherIncome"
            onValueChange={(value: number[]) =>
              setFormData({ ...formData, otherIncome: value })
            }
            value={[Number(formData.otherIncome)]}
            defaultValue={[Number(formData.otherIncome)]}
            max={10}
            min={0}
            step={0.25}
          />
          <p className="text-start mt-2">
            Enter other income as a percentage from application fees, pet fees,
            utilities, trash fees, parking fees, etc.
          </p>
        </div>

        {/* 4 */}
        <hr className="my-3" />
        <div className="">
          <div className="flex justify-between items-center mb-4">
            <p className="text-lg font-semibold">Occupancy:</p>
            <div className="relative">
              <Input
                name="occupancy"
                value={formData.occupancy[0]}
                onChange={handleChange}
              />
              <p className="text-gray-400 font-light  absolute right-2 top-1/2  transform -translate-y-1/2">
                %
              </p>
            </div>
          </div>
          <Slider
            name="occupancy"
            onValueChange={(value: number[]) =>
              setFormData({ ...formData, occupancy: value })
            }
            value={[Number(formData.occupancy)]}
            defaultValue={[Number(formData.occupancy)]}
            max={100}
            min={1}
            step={1}
          />
          <p className="text-start mt-2">
            Enter the occupancy percentage of the deal{" "}
          </p>
        </div>

        {/* 5 */}
        <hr className="my-3" />
        <div className="">
          <div className="flex justify-between items-center mb-4">
            <p className="text-lg font-semibold">Expenses:</p>
            <div className="relative">
              <Input
                name="expenses"
                value={formData.expenses[0]}
                onChange={handleChange}
              />
              <p className="text-gray-400 font-light  absolute right-2 top-1/2  transform -translate-y-1/2">
                %
              </p>
            </div>
          </div>
          <Slider
            name="expenses"
            onValueChange={(value: number[]) =>
              setFormData({ ...formData, expenses: value })
            }
            value={[Number(formData.expenses)]}
            defaultValue={[Number(formData.expenses)]}
            max={70}
            min={20}
            step={1}
          />
          <p className="text-start mt-2">
            Now enter your expenses as a percentage of your gross annual income…
          </p>
        </div>

        {/* 6 */}
        <hr className="my-3" />
        <div className="">
          <div className="flex justify-between items-center mb-4">
            <p className="text-lg font-semibold">Cap Rate:</p>
            <div className="relative">
              <Input
                name="capRate"
                value={formData.capRate[0]}
                onChange={handleChange}
              />
              <p className="text-gray-400 font-light  absolute right-2 top-1/2  transform -translate-y-1/2">
                %
              </p>
            </div>
          </div>
          <Slider
            name="capRate"
            onValueChange={(value: number[]) =>
              setFormData({ ...formData, capRate: value })
            }
            value={[Number(formData.capRate)]}
            defaultValue={[Number(formData.capRate)]}
            max={20}
            min={1}
            step={0.25}
          />
          <p className="text-start mt-2">
            Enter the Cap Rate you're willing to pay
          </p>
        </div>
      </form>
      <div className="bg-black flex justify-center items-center py-16 px-8 rounded-b-[15px] md:rounded-none md:rounded-r-[15px] rounded-bl-[15px] md:rounded-bl-none">
        <div className="w-full text-center">
          <div className="text-white py-3 rounded">
            <p>Net Operating Income</p>
            <p className="text-4xl font-semibold text-primary_green">
              {/* ${valueIncrease.netOperatingIncome.toLocaleString()} */}$
              {Number(valueIncrease.netOperatingIncome).toLocaleString()}
            </p>
          </div>{" "}
          <div className="bg-white w-full  py-3 rounded border-l-4 border-l-[#2ab499]">
            <p>Property Value Increase</p>
            <p className="text-4xl font-semibold text-primary_green">
              {/* ${valueIncrease.priceToOffer.toLocaleString()} */}$
              {Number(valueIncrease.priceToOffer).toLocaleString()}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
