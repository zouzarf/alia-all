"use client"
import React, { useState } from "react";
import Select from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import { Button, Input } from "@nextui-org/react";
import { zones } from "@prisma/client";
import { routeWater } from "./command";
import { Play, Droplet, Clock, Gauge, AlertCircle } from 'lucide-react';
export default function Routing({ zones, hubEvent }: { zones: zones[], hubEvent: string }) {
    const listOfZones = zones.map((e) => (
        <MenuItem key={e.name} value={e.name}>
            {e.name}
        </MenuItem>
    ));
    const [pumpValue, setPumpValue] = useState('1');
    const [zoneValue, setZoneValue] = useState('');
    const [warmUpPump, setWarmUpPump] = useState('0');
    const [pumpingTime, setPumpingTime] = useState('0');
    const [warmUpCompressor, setWarmUpCompressor] = useState('0');
    const [compressingTime, setCompressingTime] = useState('0');
    const [waiting, setWaiting] = useState(false);

    const isValid = !waiting && zoneValue !== '' && parseFloat(compressingTime) > 0;

    const handleStart = async () => {
        setWaiting(true);
        // Simulate API call
        await routeWater(
            pumpValue,
            warmUpPump.toString(),
            pumpingTime.toString(),
            warmUpCompressor.toString(),
            compressingTime.toString(),
            zoneValue
        );
        console.log({
            pump: pumpValue,
            zone: zoneValue,
            warmUpPump,
            pumpingTime,
            warmUpCompressor,
            compressingTime
        });
        setWaiting(false);
    };
    const handleDecimalInput = (setter: React.Dispatch<React.SetStateAction<string>>) => (e: React.ChangeEvent<HTMLInputElement>) => {
        // Replaces comma with dot for regions that use commas
        const val = e.target.value.replace(',', '.');
        setter(val);
    };
    return (
        <div className="min-h-screen bg-slate-50 dark:bg-gray-950 p-4 md:p-8 font-sans">
            <div className="max-w-4xl mx-auto">
                <div className="bg-white dark:bg-gray-900 rounded-3xl shadow-2xl overflow-hidden border border-gray-100 dark:border-gray-800">

                    {/* Header Section */}
                    <div className="bg-gradient-to-r from-blue-600 to-indigo-600 px-8 py-8 text-white">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-4">
                                <div className="p-3 bg-white/20 rounded-2xl backdrop-blur-md">
                                    <Droplet className="w-8 h-8 text-white fill-blue-200" />
                                </div>
                                <div>
                                    <h1 className="text-2xl font-bold tracking-tight">System Controller</h1>
                                </div>
                            </div>
                            <div className="hidden md:block">
                                <span className="px-3 py-1 bg-green-500/20 border border-green-400/30 rounded-full text-xs font-medium text-green-100">
                                    ● System Ready
                                </span>
                            </div>
                        </div>
                    </div>

                    <div className="p-6 md:p-10 space-y-8">
                        {/* Primary Selection Grid */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            <div className="space-y-2">
                                <label className="text-sm font-bold text-gray-600 dark:text-gray-400 uppercase tracking-wider">
                                    Pump
                                </label>
                                <select
                                    value={pumpValue}
                                    onChange={(e) => setPumpValue(e.target.value)}
                                    className="w-full px-4 py-4 bg-gray-50 dark:bg-gray-800 border-2 border-transparent focus:border-blue-500 rounded-xl outline-none transition-all text-gray-900 dark:text-white font-medium shadow-sm"
                                >
                                    <option value="1">Water Pump 01</option>
                                    <option value="2">Water Pump 02</option>
                                    <option value="3">Water Pump 03</option>
                                    <option value="4">Water Pump 04</option>
                                </select>
                            </div>

                            <div className="space-y-2">
                                <label className="text-sm font-bold text-gray-600 dark:text-gray-400 uppercase tracking-wider">
                                    Target Zone
                                </label>
                                <select
                                    value={zoneValue}
                                    onChange={(e) => setZoneValue(e.target.value)}
                                    className={`w-full px-4 py-4 bg-gray-50 dark:bg-gray-800 border-2 rounded-xl outline-none transition-all text-gray-900 dark:text-white font-medium shadow-sm
                                        ${!zoneValue ? 'border-amber-300 dark:border-amber-900' : 'border-transparent focus:border-blue-500'}`}
                                >
                                    <option value="">Select Destination...</option>
                                    {zones.map(zone => (
                                        <option key={zone.name} value={zone.name}>{zone.name}</option>
                                    ))}
                                </select>
                            </div>
                        </div>

                        <hr className="border-gray-100 dark:border-gray-800" />

                        {/* Configuration Controls */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                            {/* Pump Settings Group */}
                            <div className="space-y-6">
                                <div className="flex items-center gap-2 pb-2 border-b border-gray-100 dark:border-gray-800">
                                    <Gauge className="w-5 h-5 text-blue-500" />
                                    <h3 className="font-bold text-gray-800 dark:text-gray-200">Pump Parameters</h3>
                                </div>

                                <div className="space-y-4">
                                    <div>
                                        <label className="block text-xs font-semibold text-gray-500 mb-2">WARM-UP (SEC)</label>
                                        <input
                                            type="text"
                                            inputMode="decimal"
                                            value={warmUpPump}
                                            onChange={handleDecimalInput(setWarmUpPump)}
                                            className="w-full px-4 py-3 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-xs font-semibold text-gray-500 mb-2">FLOW DURATION (SEC)</label>
                                        <input
                                            type="text"
                                            inputMode="decimal"
                                            value={pumpingTime}
                                            onChange={handleDecimalInput(setPumpingTime)}
                                            className="w-full px-4 py-3 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                                        />
                                    </div>
                                </div>
                            </div>

                            {/* Compressor Settings Group */}
                            <div className="space-y-6">
                                <div className="flex items-center gap-2 pb-2 border-b border-gray-100 dark:border-gray-800">
                                    <Clock className="w-5 h-5 text-cyan-500" />
                                    <h3 className="font-bold text-gray-800 dark:text-gray-200">Compressor Parameters</h3>
                                </div>

                                <div className="space-y-4">
                                    <div>
                                        <label className="block text-xs font-semibold text-gray-500 mb-2">WARM-UP (SEC)</label>
                                        <input
                                            type="text"
                                            inputMode="decimal"
                                            value={warmUpCompressor}
                                            onChange={handleDecimalInput(setWarmUpCompressor)}
                                            className="w-full px-4 py-3 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-xs font-semibold text-gray-500 mb-2">COMPRESSION (SEC)</label>
                                        <input
                                            type="text"
                                            inputMode="decimal"
                                            value={compressingTime}
                                            onChange={handleDecimalInput(setCompressingTime)}
                                            className={`w-full px-4 py-3 bg-white dark:bg-gray-800 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none
                                                ${parseFloat(compressingTime) <= 0 ? 'border-red-400' : 'border-gray-200 dark:border-gray-700'}`}
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Status & Action Area */}
                        <div className="pt-6">
                            {!isValid && !waiting && (
                                <div className="mb-6 flex items-start gap-3 p-4 bg-red-50 dark:bg-red-900/20 border border-red-100 dark:border-red-800/30 rounded-xl">
                                    <AlertCircle className="w-5 h-5 text-red-500 shrink-0 mt-0.5" />
                                    <div className="text-sm text-red-700 dark:text-red-300">
                                        <span className="font-bold">Required Actions:</span>
                                        <ul className="list-disc ml-4 mt-1">
                                            {zoneValue === '' && <li>Specify a target zone for routing.</li>}
                                            {parseFloat(compressingTime) <= 0 && <li>Compression time must be a positive decimal.</li>}
                                        </ul>
                                    </div>
                                </div>
                            )}

                            <button
                                onClick={handleStart}
                                disabled={!isValid || waiting}
                                className={`
                                    w-full md:w-auto md:min-w-[240px] flex items-center justify-center gap-3 px-10 py-5 rounded-2xl font-bold text-lg transition-all
                                    ${isValid && !waiting
                                        ? 'bg-blue-600 hover:bg-blue-700 text-white shadow-xl shadow-blue-500/20 hover:shadow-blue-500/40 transform hover:-translate-y-1'
                                        : 'bg-gray-200 dark:bg-gray-800 text-gray-400 cursor-not-allowed'
                                    }
                                `}
                            >
                                {waiting ? (
                                    <>
                                        <div className="w-6 h-6 border-3 border-white border-t-transparent rounded-full animate-spin" />
                                        <span>SYSTEM CYCLING...</span>
                                    </>
                                ) : (
                                    <>
                                        <Play className="w-6 h-6 fill-current" />
                                        <span>START</span>
                                    </>
                                )}
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
