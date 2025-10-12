import {Select, SelectContent, SelectItem, SelectTrigger, SelectValue} from "@/components/ui/select";
import {useEffect, useState} from "react";
import api from "@/lib/axios";

interface DataSelectboxProps {
  dataUrl: string;
  dataIdKey: string;
  dataKey: string;
  placeholder: string;
}

export default function DataSelectbox(props: DataSelectboxProps) {
  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    api.get(props.dataUrl).then((res) => setData(res.data)).finally(() => setLoading(false));
  }, [props.dataUrl]);

  return (<div>{loading && <span>Loading...</span>}<Select>
    <SelectTrigger>
      <SelectValue placeholder={props.placeholder ?? "Select an option"}/>
    </SelectTrigger>
    <SelectContent>
      {data.length > 0 && data.map((item: any) => (
        <SelectItem value={item[props.dataIdKey]} key={item[props.dataIdKey]}>{item[props.dataKey]}</SelectItem>
      ))}
    </SelectContent>
  </Select></div>);
}