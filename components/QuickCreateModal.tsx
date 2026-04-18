"use client";

import { Building2, CreditCard, Package, Tags } from "lucide-react";

import CartTable from "@/components/CartTable";
import CustomerSearch from "@/components/CustomerSearch";
import DropdownSelect from "@/components/DropdownSelect";
import InvoicePreview from "@/components/InvoicePreview";
import InvoiceSection from "@/components/InvoiceSection";
import ProductSelector from "@/components/ProductSelector";
import SubmitButtons from "@/components/SubmitButtons";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useOrderStore } from "@/lib/store";

interface QuickCreateModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export default function QuickCreateModal({
  open,
  onOpenChange,
}: QuickCreateModalProps) {
  const organization = useOrderStore((state) => state.organization);
  const warehouse = useOrderStore((state) => state.warehouse);
  const paybox = useOrderStore((state) => state.paybox);
  const priceType = useOrderStore((state) => state.priceType);
  const setOrganization = useOrderStore((state) => state.setOrganization);
  const setWarehouse = useOrderStore((state) => state.setWarehouse);
  const setPaybox = useOrderStore((state) => state.setPaybox);
  const setPriceType = useOrderStore((state) => state.setPriceType);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[92vh] overflow-hidden p-0">
        <div className="border-b border-slate-200 px-5 py-4 dark:border-slate-800">
          <DialogHeader>
            <DialogTitle className="text-xl text-slate-950 dark:text-slate-100">
              Create Sale
            </DialogTitle>
            <DialogDescription>
              This modal is wired to the live TableCRM token and uses the real
              `docs_sales` create schema.
            </DialogDescription>
          </DialogHeader>
        </div>

        <div className="grid max-h-[calc(92vh-82px)] gap-0 xl:grid-cols-[minmax(0,1fr)_360px]">
          <div className="overflow-y-auto px-4 py-4 sm:px-5">
            <div className="space-y-4">
              <CustomerSearch />
              <InvoiceSection />
              <div className="grid gap-4 md:grid-cols-2">
                <DropdownSelect
                  label="Organization"
                  endpoint="/organizations"
                  placeholder="Select organization"
                  icon={Building2}
                  value={organization}
                  onChange={setOrganization}
                />
                <DropdownSelect
                  label="Warehouse"
                  endpoint="/warehouses"
                  placeholder="Select warehouse"
                  icon={Package}
                  value={warehouse}
                  onChange={setWarehouse}
                />
                <DropdownSelect
                  label="Paybox"
                  endpoint="/payboxes"
                  placeholder="Select paybox"
                  icon={CreditCard}
                  value={paybox}
                  onChange={setPaybox}
                />
                <DropdownSelect
                  label="Price Type"
                  endpoint="/price_types"
                  placeholder="Select price type"
                  icon={Tags}
                  value={priceType}
                  onChange={setPriceType}
                />
              </div>
              <ProductSelector />
              <CartTable />
              <div className="xl:hidden">
                <InvoicePreview />
              </div>
              <SubmitButtons />
            </div>
          </div>

          <div className="hidden border-l border-slate-200 bg-slate-50/60 p-4 dark:border-slate-800 dark:bg-slate-950/50 xl:block">
            <InvoicePreview />
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
