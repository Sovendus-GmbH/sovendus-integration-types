import { Label } from "@radix-ui/react-label";
import { motion } from "framer-motion";
import {
  CheckCircle,
  ChevronRight,
  Cog,
  ExternalLink,
  Gift,
  ShoppingBag,
} from "lucide-react";
import type { Dispatch, JSX, SetStateAction } from "react";
import React, { useState } from "react";
import type {
  CountryCodes,
  SovendusAppSettings,
  VoucherNetworkSettings,
} from "sovendus-integration-types";
import { LANGUAGES_BY_COUNTRIES } from "sovendus-integration-types";

import {
  EnabledVoucherNetworkCountries,
  isVnEnabled,
} from "../../settings/app-settings";
import { cn } from "../lib/utils";
import { type AdditionalSteps, DEMO_REQUEST_URL } from "./backend-form";
import { Alert, AlertDescription } from "./ui/alert";
import { Button } from "./ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "./ui/card";
import { Checkbox } from "./ui/checkbox";
import { Progress } from "./ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import { CountryOptions } from "./voucher-network-country-options";

interface SovendusVoucherNetworkProps {
  currentSettings: VoucherNetworkSettings;
  setCurrentSettings: Dispatch<SetStateAction<SovendusAppSettings>>;
  additionalSteps?: AdditionalSteps["voucherNetwork"];
}

export function SovendusVoucherNetwork({
  currentSettings,
  setCurrentSettings,
  additionalSteps,
}: SovendusVoucherNetworkProps): JSX.Element {
  const vnEnabled = isVnEnabled(currentSettings);

  const [currentStep, setCurrentStep] = useState(0);
  const [setupStepsCompleted, setSetupStepsCompleted] = useState({
    goToSettings: false,
    addToThankYou: false,
    addToOrderStatus: false,
  });
  const [testStepsCompleted, setTestStepsCompleted] = useState({
    placeTestOrder: false,
    checkThankYou: false,
    checkOrderStatus: false,
  });

  const totalSteps = 3; // 1. Additional Setup Steps, 2. Configure Settings, 3. Test the App

  const nextStep = (): void => {
    if (currentStep < totalSteps - 1) {
      setCurrentStep(currentStep + 1);
    }
  };

  const prevStep = (): void => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleSetupStepChange = (
    step: "goToSettings" | "addToThankYou" | "addToOrderStatus",
  ): void => {
    setSetupStepsCompleted((prev) => ({
      ...prev,
      [step]: !prev[step],
    }));
  };

  const handleTestStepChange = (
    step: "placeTestOrder" | "checkThankYou" | "checkOrderStatus",
  ): void => {
    setTestStepsCompleted((prev) => ({
      ...prev,
      [step]: !prev[step],
    }));
  };

  const allSetupStepsCompleted =
    Object.values(setupStepsCompleted).every(Boolean);

  const allTestStepsCompleted =
    Object.values(testStepsCompleted).every(Boolean);

  const [isImageVisible, setIsImageVisible] = useState(false);

  const renderSetupStep = (step: number): JSX.Element => {
    if (step === 0) {
      return (
        <Card className="mt-6">
          <CardHeader>
            <CardTitle className="text-xl font-semibold flex items-center">
              <Gift className="w-6 h-6 mr-2 text-blue-500" />
              Step 1: Add the Sovendus App to your checkout page
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-lg mb-4">
              Complete the following steps to set up Voucher Network & Checkout
              Benefits:
            </p>
            <div className="space-y-4">
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="goToSettings"
                  checked={setupStepsCompleted.goToSettings}
                  onCheckedChange={(): void =>
                    handleSetupStepChange("goToSettings")
                  }
                />
                TODO: In der Vorschau im Checkout Editor würde das Banner nur
                angezeigt werden wenn Sprache und Lieferland zusammen passen und
                das jeweilige Land aktiviert ist
                <Label htmlFor="goToSettings">
                  {
                    'Go to "Settings" -> "Checkout" -> click on "Customize" to customize your checkout pages'
                  }
                </Label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="addToThankYou"
                  checked={setupStepsCompleted.addToThankYou}
                  onCheckedChange={(): void =>
                    handleSetupStepChange("addToThankYou")
                  }
                />
                <Label htmlFor="addToThankYou">
                  Click on "Checkout" in the top middle and then on "Thank you".
                  Click on "Add App block" on the bottom left, then on "Sovendus
                  App" and then "Save"
                </Label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="addToOrderStatus"
                  checked={setupStepsCompleted.addToOrderStatus}
                  onCheckedChange={(): void =>
                    handleSetupStepChange("addToOrderStatus")
                  }
                />
                <Label htmlFor="addToOrderStatus">
                  Click on "Thank you" in the top middle and then on "Order
                  status". Click on "Add App block" on the bottom left, then on
                  "Sovendus App" and then "Save"
                </Label>
              </div>
            </div>
            <Button
              onClick={nextStep}
              disabled={!allSetupStepsCompleted}
              className="mt-4"
            >
              Proceed to Configuration
              <ChevronRight className="ml-2 h-5 w-5" />
            </Button>
          </CardContent>
        </Card>
      );
    } else if (step === 1) {
      return (
        <Card className="mt-6">
          <CardHeader>
            <CardTitle className="text-xl font-semibold flex items-center">
              <Cog className="w-6 h-6 mr-2 text-blue-500" />
              Step 2: Configure Settings
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-lg mb-4">
              Great job completing the setup! Now, let's configure your Voucher
              Network & Checkout Benefits settings.
            </p>
            <EnabledVoucherNetworkCountries currentSettings={currentSettings} />
            <div className="mt-6">
              <h3 className="text-lg font-semibold mb-2">
                Country-Specific Settings
              </h3>
              <CountryOptions
                currentSettings={currentSettings}
                setCurrentSettings={setCurrentSettings}
                countryCodes={
                  Object.keys(LANGUAGES_BY_COUNTRIES) as CountryCodes[]
                }
              />
            </div>
          </CardContent>
        </Card>
      );
    }
    return (
      <Card className="mt-6">
        <CardHeader>
          <CardTitle className="text-xl font-semibold flex items-center">
            <Cog className="w-6 h-6 mr-2 text-blue-500" />
            Step 3: Test the App
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-lg mb-4">
            To test the integration, follow these steps:
          </p>
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <Checkbox
                id="placeTestOrder"
                checked={testStepsCompleted.placeTestOrder}
                onCheckedChange={(): void =>
                  handleTestStepChange("placeTestOrder")
                }
              />
              <Label htmlFor="placeTestOrder">
                Go to your Shopify store and place a test order to access the
                "Thank You" page. Ensure that the order completes successfully
                and that you are redirected to the confirmation page.
              </Label>
            </div>
            <div className="flex items-center space-x-2">
              <Checkbox
                id="checkThankYou"
                checked={testStepsCompleted.checkThankYou}
                onCheckedChange={(): void =>
                  handleTestStepChange("checkThankYou")
                }
              />
              <Label htmlFor="checkThankYou">
                Verify that the Sovendus integration is visible. Ensure that the
                Sovendus banner is displayed in the correct position, as shown
                in the example image below.
              </Label>
            </div>
            <Button onClick={() => setIsImageVisible(!isImageVisible)}>
              {isImageVisible ? "Hide Image" : "Show Image"}
            </Button>
            {isImageVisible && (
              <motion.img
                src="https://raw.githubusercontent.com/Sovendus-GmbH/Sovendus-Voucher-Network-and-Checkout-Benefits-App-for-Shopify/main/Shopify-App.png"
                alt="Thank-You-Page-Example"
                className="rounded-lg shadow-md"
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.3 }}
              />
            )}
            <div className="flex items-center space-x-2">
              <Checkbox
                id="checkOrderStatus"
                checked={testStepsCompleted.checkOrderStatus}
                onCheckedChange={(): void =>
                  handleTestStepChange("checkOrderStatus")
                }
              />
              <Label htmlFor="checkOrderStatus">
                Now reload the page to access the "Order Status" page. Verify
                that the Sovendus integration is visible. Ensure that the
                Sovendus banner is displayed in the correct position, as shown
                in the example image below.
              </Label>
              <img src="" alt="" />
            </div>
          </div>
        </CardContent>
      </Card>
    );
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className={cn("space-y-6 pb-8")}
    >
      <div
        className={cn(
          "bg-gradient-to-r from-blue-600 to-indigo-600 text-white p-8 rounded-lg shadow-lg",
        )}
      >
        <h2 className={cn("text-3xl font-bold mb-4 text-white")}>
          Voucher Network & Checkout Benefits: Dual Revenue Streams
        </h2>
        <p className={cn("text-xl mb-6")}>
          Boost traffic and sales with our closed voucher network, while
          rewarding customers at checkout and earning extra revenue.
        </p>
        <Button
          size="lg"
          onClick={(): void => void window.open(DEMO_REQUEST_URL, "_blank")}
          className={cn("bg-white text-blue-600 hover:bg-blue-100")}
        >
          Schedule Your Personalized Demo
          <ExternalLink className={cn("ml-2 h-4 w-4")} />
        </Button>
      </div>

      <Alert className={cn("mb-4 bg-blue-50 border-blue-200")}>
        <AlertDescription className={cn("text-blue-700 font-semibold")}>
          <strong>Important:</strong> To activate Voucher Network and/or
          Checkout Benefits, contact Sovendus for a personalized demo and setup.
          Our team will guide you through the entire process.
        </AlertDescription>
      </Alert>

      <Tabs defaultValue="configure" className={cn("w-full")}>
        <TabsList className={cn("grid w-full grid-cols-3 mb-8")}>
          <TabsTrigger
            value="configure"
            className={cn(
              "text-lg font-semibold py-3 bg-blue-100 data-[state=active]:bg-blue-600 data-[state=active]:text-white",
            )}
          >
            Configure
          </TabsTrigger>
          <TabsTrigger
            value="benefits"
            className={cn(
              "text-lg font-semibold py-3 bg-blue-100 data-[state=active]:bg-blue-600 data-[state=active]:text-white",
            )}
          >
            Key Benefits
          </TabsTrigger>
          <TabsTrigger
            value="how-it-works"
            className={cn(
              "text-lg font-semibold py-3 bg-blue-100 data-[state=active]:bg-blue-600 data-[state=active]:text-white",
            )}
          >
            How It Works
          </TabsTrigger>
        </TabsList>
        <TabsContent value="configure">
          <Alert className="mb-4 bg-yellow-50 border-yellow-200">
            <AlertDescription className="text-yellow-700 font-semibold">
              <strong>Important:</strong> Follow the three-step guide below to
              set up your Voucher Network & Checkout Benefits. Our team is here
              to assist you throughout the process.
            </AlertDescription>
          </Alert>
          <div className="flex justify-between mt-6">
            <Button
              onClick={prevStep}
              disabled={currentStep === 0}
              variant="outline"
            >
              Previous Step
            </Button>
            <Button
              onClick={nextStep}
              disabled={
                currentStep === totalSteps - 1 ||
                (currentStep === 0 && !allSetupStepsCompleted) ||
                (currentStep === totalSteps && !allTestStepsCompleted)
              }
            >
              {currentStep === totalSteps - 1 ? "Finish Setup" : "Next Step"}
            </Button>
          </div>
          <Card>
            <CardHeader>
              <CardTitle>Setup Progress</CardTitle>
              <CardDescription>
                Complete all steps to activate Voucher Network & Checkout
                Benefits
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Progress
                value={((currentStep + 1) / totalSteps) * 100}
                className="w-full"
              />
              <p className="mt-2 text-sm text-gray-600">
                Step {currentStep + 1} of {totalSteps}
              </p>
            </CardContent>
          </Card>

          {renderSetupStep(currentStep)}
          <div className="flex justify-between mt-6">
            <Button
              onClick={prevStep}
              disabled={currentStep === 0}
              variant="outline"
            >
              Previous Step
            </Button>
            <Button
              onClick={nextStep}
              disabled={
                currentStep === totalSteps - 1 ||
                (currentStep === 0 && !allSetupStepsCompleted) ||
                (currentStep === totalSteps && !allTestStepsCompleted)
              }
            >
              {currentStep === totalSteps - 1 ? "Finish Setup" : "Next Step"}
            </Button>
          </div>
          {/* <div className="space-y-6">
            <Alert
              className={cn(
                `${
                  vnEnabled
                    ? "bg-green-50 border-green-200"
                    : "bg-red-50 border-red-200"
                } mt-2`,
              )}
            >
              <AlertDescription
                className={cn(vnEnabled ? "text-green-700" : "text-red-700")}
              >
                <EnabledVoucherNetworkCountries
                  currentSettings={currentSettings}
                />
              </AlertDescription>
            </Alert>
            {additionalSteps && (
              <Card className={cn("border-2 border-blue-500")}>
                <CardHeader>
                  <CardTitle
                    className={cn("text-xl font-semibold flex items-center")}
                  >
                    <CheckCircle className={cn("w-6 h-6 mr-2 text-blue-500")} />
                    Additional Setup Steps
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <h4 className={cn("font-semibold mb-2")}>
                    {additionalSteps.title}
                  </h4>
                  <ol className={cn("list-decimal list-inside space-y-2")}>
                    {additionalSteps.subSteps.map((step, index) => (
                      <li key={index}>{step}</li>
                    ))}
                  </ol>
                </CardContent>
              </Card>
            )}

            <Accordion type="single" collapsible className={cn("w-full mt-8")}>
              <AccordionItem
                value="step1"
                className={cn(
                  "border-2 border-blue-500 rounded-lg overflow-hidden",
                )}
              >
                <AccordionTrigger
                  className={cn("bg-blue-50 p-4 text-xl font-semibold")}
                >
                  <div className={cn("flex items-center")}>
                    <Cog className={cn("w-6 h-6 mr-2 text-blue-500")} />
                    Configure Voucher Network & Checkout Benefits
                  </div>
                </AccordionTrigger>
                <AccordionContent className={cn("p-4 bg-white")}>
                  <p className={cn("mb-4 text-lg")}>
                    Maximize your revenue potential by setting up Voucher
                    Network and Checkout Benefits for multiple countries and
                    languages. This configuration applies to both products,
                    unlocking new markets and opportunities for growth.
                  </p>
                  <CountryOptions
                    currentSettings={currentSettings}
                    setCurrentSettings={setCurrentSettings}
                    countryCodes={
                      Object.keys(LANGUAGES_BY_COUNTRIES) as CountryCodes[]
                    }
                  />
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </div> */}
        </TabsContent>
        <TabsContent value="benefits">
          <div className={cn("grid grid-cols-1 md:grid-cols-2 gap-6 mb-8")}>
            <Card>
              <CardHeader>
                <CardTitle className={cn("flex items-center")}>
                  <Gift className={cn("mr-2 h-5 w-5 text-blue-500")} />
                  Voucher Network
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p>
                  Gain traffic and new sales through our closed voucher network
                  with over 7 million online shoppers every month.
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle className={cn("flex items-center")}>
                  <ShoppingBag className={cn("mr-2 h-5 w-5 text-green-500")} />
                  Checkout Benefits
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p>
                  Generate additional revenue by displaying offers from other
                  shops on your checkout page. Earn commissions when your
                  customers make purchases from these partner offers.
                </p>
              </CardContent>
            </Card>
          </div>
          <div className={cn("bg-gray-100 p-6 rounded-lg mb-8")}>
            <h3 className={cn("text-2xl font-semibold mb-4")}>Key Benefits</h3>
            <ul className={cn("list-disc list-inside space-y-2")}>
              <li>
                <strong>Massive Reach:</strong> Connect with 7 million online
                shoppers monthly through our network of 2,300+ European
                partners.
              </li>
              <li>
                <strong>Performance-Based:</strong> Pay only for generated
                purchases in your shop, with no minimum contract duration.
              </li>
              <li>
                <strong>Dual Revenue Streams:</strong> Attract new customers
                through Voucher Network and earn additional revenue with
                Checkout Benefits.
              </li>
              <li>
                <strong>Seamless Integration:</strong> Easy setup process for
                both products with a single configuration.
              </li>
            </ul>
          </div>
        </TabsContent>
        <TabsContent value="how-it-works">
          <div className={cn("bg-gray-50 p-6 rounded-lg mt-6 space-y-4")}>
            <h3 className={cn("text-2xl font-semibold mb-4")}>
              How Voucher Network & Checkout Benefits Work
            </h3>
            <ol className={cn("space-y-4")}>
              <li className={cn("flex items-start")}>
                <CheckCircle
                  className={cn(
                    "mr-2 h-5 w-5 text-green-500 mt-1 flex-shrink-0",
                  )}
                />
                <div>
                  <strong className={cn("text-lg")}>
                    Voucher Network Integration:
                  </strong>
                  <p>
                    After setup, your shop's vouchers are displayed on partner
                    checkout pages, attracting new customers to your store.
                  </p>
                </div>
              </li>
              <li className={cn("flex items-start")}>
                <CheckCircle
                  className={cn(
                    "mr-2 h-5 w-5 text-green-500 mt-1 flex-shrink-0",
                  )}
                />
                <div>
                  <strong className={cn("text-lg")}>
                    Checkout Benefits Display:
                  </strong>
                  <p>
                    Partner offers are shown on your checkout page, providing
                    additional value to your customers and generating commission
                    for you.
                  </p>
                </div>
              </li>
              <li className={cn("flex items-start")}>
                <CheckCircle
                  className={cn(
                    "mr-2 h-5 w-5 text-green-500 mt-1 flex-shrink-0",
                  )}
                />
                <div>
                  <strong className={cn("text-lg")}>
                    Dual Revenue Generation:
                  </strong>
                  <p>
                    Benefit from new customer acquisitions through your vouchers
                    and earn commissions from partner sales.
                  </p>
                </div>
              </li>
              <li className={cn("flex items-start")}>
                <CheckCircle
                  className={cn(
                    "mr-2 h-5 w-5 text-green-500 mt-1 flex-shrink-0",
                  )}
                />
                <div>
                  <strong className={cn("text-lg")}>
                    Continuous Optimization:
                  </strong>
                  <p>
                    Our team works with you to refine your offers and placements
                    for maximum performance and revenue.
                  </p>
                </div>
              </li>
            </ol>
          </div>
        </TabsContent>
      </Tabs>
    </motion.div>
  );
}
