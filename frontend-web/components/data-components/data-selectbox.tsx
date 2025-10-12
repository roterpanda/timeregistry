import {Select, SelectContent, SelectItem, SelectTrigger, SelectValue} from "@/components/ui/select";
import {useEffect, useState} from "react";
import api from "@/lib/axios";


type SelectItemProps = {
  [key: string]: string | undefined;
}

type SelectItemList = SelectItemProps[];

interface DataSelectboxProps {
  dataUrl: string;
  dataIdKey: string;
  dataKey: string;
  placeholder: string;
  value?: number;
  onValueChange?: (value: string) => void;
}

export default function DataSelectbox(props: DataSelectboxProps) {
  const [data, setData] = useState<SelectItemList>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    api.get(props.dataUrl).then((res) => setData(res.data)).finally(() => setLoading(false));
  }, [props.dataUrl]);

  return (<div>{loading && <span>Loading...</span>}
    <Select value={props.value?.toString()} onValueChange={props.onValueChange}>
    <SelectTrigger>
      <SelectValue placeholder={props.placeholder ?? "Select an option"}/>
    </SelectTrigger>
    <SelectContent>
      {data.length > 0 && data.map((item: SelectItemProps) => (
        <SelectItem value={item[props.dataIdKey]?.toString() || ""} key={item[props.dataIdKey]}>{item[props.dataKey]}</SelectItem>
      ))}
    </SelectContent>
  </Select></div>);
}