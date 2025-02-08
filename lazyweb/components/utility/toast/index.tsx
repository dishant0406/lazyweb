"use client";

import { AxiosError, type AxiosPromise } from "axios";
import { CircleCheck, Globe, InfoIcon } from "lucide-react";
import { useEffect } from "react";
import toast, { Toaster as LazyToast, useToasterStore } from "react-hot-toast";

export const successToast = (message: string) => {
  toast.success(message, {
    icon: <CircleCheck className="w-6 h-6 text-text-primary" />,
  });
};

export const errorToast = (message: string) => {
  toast.error(message, {
    icon: <InfoIcon className="w-6 h-6 text-text-primary" />,
  });
};

export const infoToast = (message: string) => {
  toast(message, {
    icon: <Globe className="w-6 h-6 text-text-primary" />,
  });
};

type PromiseOptions = {
  loadingText?: string;
  errorMessage?: string;
  setLoading?: (loading: boolean) => void;
  final?: () => void;
  onSuccess?: (data: any) => void;
  onError?: () => void;
};

export const promiseToast = async (
  promise: Promise<any>,
  successMessage?: string,
  promiseOptions?: PromiseOptions
): Promise<
  | AxiosPromise
  | {
      data: any;
    }
> => {
  const {
    loadingText = "Loading...",
    errorMessage = "Something went wrong",
    setLoading,
    final,
    onError,
    onSuccess,
  } = promiseOptions || {
    loadingText: "Loading...",
    errorMessage: "Something went wrong",
  };
  let ptoast = null;

  if (successMessage) {
    ptoast = toast.loading(loadingText);
  }

  try {
    setLoading?.(true);
    const data = await promise;

    if (ptoast) {
      toast.dismiss(ptoast);
    }

    if (successMessage) {
      successToast(successMessage);
    }

    onSuccess?.(data);
    return data;
  } catch (error: unknown) {
    if (ptoast) {
      toast.dismiss(ptoast);
    }

    let message: string;

    if (error instanceof AxiosError) {
      message =
        error.response?.data?.message ||
        error.response?.data?.error ||
        error.response?.data ||
        error.message ||
        errorMessage;
    } else if (error instanceof Error) {
      message = error.message || errorMessage;
    } else if (typeof error === "string") {
      message = error;
    } else {
      message = errorMessage;
    }

    errorToast(message.toString());
    onError?.();
    return {
      data: null,
    };
  } finally {
    setLoading?.(false);
    final?.();
  }
};

function useMaxToasts(max: number) {
  const { toasts } = useToasterStore();

  useEffect(() => {
    toasts
      .filter((t) => t.visible) // Only consider visible toasts
      .filter((_, i) => i >= max) // Is toast index over limit?
      .forEach((t) => toast.dismiss(t.id)); // Dismiss – Use toast.remove(t.id) for no exit animation
  }, [toasts, max]);
}

export const Toaster = ({
  max = 10,
  ...props
}: React.ComponentProps<typeof LazyToast> & {
  max?: number;
}) => {
  useMaxToasts(max);

  return (
    <LazyToast
      toastOptions={{
        className: `!bg-background dark !border !border-input !rounded-md !text-text-primary`,
        position: "bottom-right",
      }}
      {...props}
    />
  );
};
