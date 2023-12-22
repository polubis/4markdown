import React from 'react';
import MUISelect, { SelectProps as MUISelectProps } from '@mui/material/Select';
import { Button, MenuItem } from '@mui/base';
import { useForm } from 'react-hook-form';

interface SelectProps<T> extends MUISelectProps<T> {
  dataTestId: string;
}

// T = model wartości - string, object, number
// T dla value, wartosc w callbacku onChange, oraz dla opcji po ktorych iterujemy
const Select = <T extends unknown>({
  dataTestId,
  ...props
}: SelectProps<T>) => {
  return <MUISelect {...props} data-test-id={dataTestId} />;
};

const CMp = () => {
  // DAne z backendu -> mapujecie je na options -> mapujecie je na komponent wewnatrz select.
  // Dane z backendu -> mapujecie je na komponent.
  return (
    <Select
      labelId="demo-simple-select-label"
      id="demo-simple-select"
      value={1}
      dataTestId="my-select"
      label="Age"
      onChange={(v) => {
        console.log(v);
      }}
    >
      {[1, 2, 3].map((item) => (
        <MenuItem key={item} value={10}>
          Ten
        </MenuItem>
      ))}
      {/* <MenuItem value={20}>Twenty</MenuItem>
      <MenuItem value={30}>Thirty</MenuItem> */}
    </Select>
  );
};

const SelectWithButtonTrigger = <T extends unknown>(
  props: Omit<SelectProps<T>, 'input'>,
) => {
  return <Select {...props} input={<Button>CLick me</Button>} />;
};

// const SelectWithOptionsAndTypeGuard = <T extends unknown>(
//   props: Omit<SelectProps<T>, 'children'> & { options: T[] },
// ) => {
//   return (
//     <Select {...props}>
//       {props.options.map((option) => {
//         // Typeguard - nie najlepsze rozwiazanie, zlozonosc onliczeniowa
//         if (typeof option === `number` || typeof option === `string`) {
//           return <MenuItem key={option}>{option}</MenuItem>;
//         }

//         if (typeof option === `object` && option !== null) {
//           return <MenuItem key={option.key}>{option.value}</MenuItem>;
//         }

//         throw Error('Only numbers and only strings and object are supported');
//       })}
//     </Select>
//   );
// };

interface SelectOption {
  key: string | number;
  value: React.ReactNode;
}

const SelectWithOptionsAndTypeGuard = <T extends unknown>(
  props: Omit<SelectProps<T>, 'children'> & { options: SelectOption[] },
) => {
  return (
    <Select {...props}>
      {props.options.map((option) => {
        return <MenuItem key={option.key}>{option.value}</MenuItem>;
      })}
    </Select>
  );
};

// With React Hook Forms

const WithReactHookFormsSelect = () => {
  const { register, handleSubmit } = useForm();
  const [data, setData] = useState(``);

  return (
    <SelectWithOptionsAndTypeGuard
      dataTestId="something"
      options={[]}
      {...register(`firstName`)}
    />
  );
};

export { Select, SelectWithButtonTrigger, SelectWithOptionsAndTypeGuard };
