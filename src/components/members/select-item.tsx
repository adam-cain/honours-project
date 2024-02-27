import * as Select from '@radix-ui/react-select';
import classnames from "classnames";
import { CheckIcon } from "lucide-react";
import { forwardRef } from "react";

type SelectItemProps = {
    children: React.ReactNode;
    className?: string;
    value?: string;
};

const SelectItem = forwardRef<HTMLDivElement, SelectItemProps>(
    ({ children, className, ...props }, ref) => {
        return (
            <Select.Item
                className={classnames(
                    'text-[13px] leading-none  rounded-[3px] flex items-center h-[25px] pr-[35px] pl-[25px] relative select-none data-[disabled]:text-mauve8 data-[disabled]:pointer-events-none data-[highlighted]:outline-none data-[highlighted]:bg-white data-[highlighted]:text-black',
                    className
                )}
                {...props}
                ref={ref}
                value={props.value || ''}
            >
                <Select.ItemText>{children}</Select.ItemText>
                <Select.ItemIndicator className="absolute left-0 w-[25px] inline-flex items-center justify-center">
                    <CheckIcon />
                </Select.ItemIndicator>
            </Select.Item>
        );
    }
);

SelectItem.displayName = 'SelectItem';

export {SelectItem};