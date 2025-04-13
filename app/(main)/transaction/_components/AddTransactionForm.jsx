"use client";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

import { createTransaction } from "@/actions/transaction";
import { transactionSchema } from "@/app/lib/schema";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Calendar } from "@/components/ui/calendar";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useFetch } from "@/hooks/useFetch";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import CreateAccountDrawer from "@/components/create-account-drawer";
import { format } from "date-fns";
import { CalendarIcon } from "lucide-react";
import { Switch } from "@/components/ui/switch";
import { toast } from "sonner";

const AddTransactionForm = ({ accounts, catogery }) => {
  const router = useRouter();
  const {
    register,
    watch,
    reset,
    setValue,
    formState: { errors },
    getValues,
    handleSubmit,
  } = useForm({
    resolver: zodResolver(transactionSchema),
    defaultValues: {
      accountId: accounts.find((acc) => acc.isDefault)?.id,
      description: "",
      category: "",
      amount: "",
      type: "EXPENSE",
      date: new Date(),
      isRecurring: false,
    },
  });
  const {
    fn: transactionFn,
    loading: isCreating,
    data: res,
  } = useFetch(createTransaction);
  const type = watch("type");
  const isRecurring = watch("isRecurring");
  const date = watch("date");
  const filterCategories = catogery.filter((cat) => cat.type === type);
  const onsubmit = async (data) => {
    const formData = {
      ...data,
      amount: parseFloat(data.amount),
    };

    
    await transactionFn(formData);
  };
  useEffect(() => {
    if (res?.success && !isCreating) {
      toast.success("Transaction Created Successfully");
      reset();
      router.push(`/account/${res.transaction.accountId}`);
    }
  }, [res, isCreating]);

  return (
    <form
      onSubmit={handleSubmit(onsubmit)}
      className="flex flex-col gap-4"

    >
      {/* Ai Reciept */}
      <div className="">
        <label className="font-medium text-sm">
          Type
          <Select
            defaultValue={type}
            onValueChange={(e) => setValue("type", e)}
          >
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Select a Type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="EXPENSE">Expense</SelectItem>
              <SelectItem value="INCOME">Income</SelectItem>
            </SelectContent>
          </Select>
          {errors.type && (
            <p className="text-red-500 text-sm">{errors.type.message}</p>
          )}
        </label>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 ">
        <div className="space-y-2 w-full">
          <label className="font-medium text-sm">
            Amount
            <Input
              type={"number"}
              placeholder="0.00"
              {...register("amount")}
              step={"0.01"}
            />
            {errors.amount && (
              <p className="text-red-500 text-sm">{errors.amount.message}</p>
            )}
          </label>
        </div>
        <div className="space-y-2 ">
          <label className="font-medium text-sm">
            Account
            <Select
              className=""
              defaultValue={getValues("accountId")}
              onValueChange={(e) => setValue("accountId", e)}
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select a Type" />
              </SelectTrigger>
              <SelectContent className={"w-full"}>
                {accounts.map((account) => (
                  <SelectItem key={account.id} value={account.id}>
                    {account.name} (${parseFloat(account.balance).toFixed(2)})
                  </SelectItem>
                ))}
                <CreateAccountDrawer>
                  <Button
                    variant={"ghost"}
                    className="w-full text-left text-sm outline-none"
                  >
                    Create Account
                  </Button>
                </CreateAccountDrawer>
              </SelectContent>
            </Select>
            {errors.accountId && (
              <p className="text-red-500 text-sm">{errors.accountId.message}</p>
            )}
          </label>
        </div>
      </div>
      <div className="space-y-2 ">
        <label className="font-medium text-sm">
          Category
          <Select
            className=""
            value={getValues("category")}

            onValueChange={(e) => setValue("category", e)}
          >
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Select The Category...." />
            </SelectTrigger>
            <SelectContent className={"w-full"}>
              {filterCategories.map((cat) => (
                <SelectItem key={cat.id} value={cat.id}>
                  {cat.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {errors.category && (
            <p className="text-red-500 text-sm">{errors.category.message}</p>
          )}
        </label>
      </div>
      <div className="space-y-2 ">
        <label className="font-medium text-sm">
          Date
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                className="w-full text-left font-normal"
              >
                {date ? (
                  format(new Date(date), "PPP")
                ) : (
                  <span>"Pick a Date"</span>
                )}
                <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
              </Button>
            </PopoverTrigger>
            <PopoverContent className={"w-auto p-0"} align="start">
              <Calendar
                mode="single"
                value={date}
                onSelect={(e) => {
                  setValue("date", e);
                }}
                disabled={(date) => {
                  const today = new Date();
                  return date > today || date < new Date("1900-01-01");
                }}
                intialFocus
              />
            </PopoverContent>
          </Popover>
          {errors.date && (
            <p className="text-red-500 text-sm">{errors.date.message}</p>
          )}
        </label>
      </div>
      <div className="space-y-2 w-full">
        <label className="font-medium text-sm">
          Description
          <Input
            placeholder="Enter A description..."
            {...register("description")}
          />
          {errors.amount && (
            <p className="text-red-500 text-sm">{errors.amount.message}</p>
          )}
        </label>
      </div>
      <div className="flex flex-col gap-1 p-3 rounded-lg border">
        <div className="flex items-center justify-between">
          <div className="">
            <label className="text-sm font-medium cursor-pointer">
              Recurring Transaction
            </label>
            <p className="text-muted-foreground text-sm">
              Set a recurring schedule for this transaction
            </p>
          </div>
          <Switch
            checked={isRecurring}
            onCheckedChange={(e) => {
              setValue("isRecurring", e);
            }}
          />
        </div>
      </div>
      {isRecurring && (
        <label className="font-medium text-sm">
          Recurring Interval
          <Select onValueChange={(e) => setValue("recurringInterval", e)}>
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Select the Interval" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="DAILY">Daily</SelectItem>
              <SelectItem value="WEEKLY">Weekly</SelectItem>
              <SelectItem value="MONTHLY">Monthly</SelectItem>
              <SelectItem value="YEARLY">Yearly</SelectItem>
            </SelectContent>
          </Select>
          {errors.recurringInterval && (
            <p className="text-red-500 text-sm">
              {errors.recurringInterval.message}
            </p>
          )}
        </label>
      )}
   <div className="flex gap-4 w-full">
  <Button
    className="flex-1"
    variant="outline"
    disabled={isCreating}
    type="button"
    onClick={() => router.back()}
  >
    Cancel
  </Button>
  <Button
    type="submit"
    disabled={isCreating}
    className="flex-1"
  >
    Create Transaction
  </Button>
</div>
    </form>
  );
};

export default AddTransactionForm;
