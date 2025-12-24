"use server"
import prisma from "@/lib/db";
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
const fs = require('fs');
const path = require('path');
export const init = async () => {
    const sqlFilePath = path.resolve(process.cwd(), 'public/init.sql');
    const sqls = fs.readFileSync(sqlFilePath, 'utf8').split(";");
    console.log("executing")
    for (const sql of sqls) {
        await prisma.$queryRawUnsafe(sql)
    }
    console.log("executed")
    revalidatePath('/')
    redirect(`/`)
}