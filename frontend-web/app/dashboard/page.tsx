"use client";

import {useEffect, useState} from "react";
import axios, {AxiosResponse} from "axios";
import {useRouter} from "next/navigation";


export default function Dashboard() {
  const [data, setData] = useState<string>("");
  const router = useRouter();

  useEffect(() => {
    axios.get("/api/proxy/v1/protected")
      .then((res: AxiosResponse) => {
        setData(res.data);
      })
      .catch (() => {
        router.push("/login");
      });
  }, [router]);


  return (
    <div className="w-1/2 p-4 space-y-4 m-auto shadow rounded-2xl">
      <h1 className="text-2xl">
        Dashboard
      </h1>
      <p>
        {data ? data : "Error"}
      </p>
    </div>


  )
}