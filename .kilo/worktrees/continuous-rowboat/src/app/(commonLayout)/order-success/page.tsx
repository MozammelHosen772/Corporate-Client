import OrderSuccessPage from "@/modules/OrderSuccessPage/OrderSuccessPage";
import { Suspense } from "react";

export default function Page() {
  return (
    <Suspense fallback={null}>
      <OrderSuccessPage />
    </Suspense>
  );
}
