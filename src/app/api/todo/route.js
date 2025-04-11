import { connectDB } from "@/lib/config/db";
import todoModel from "@/lib/models/todoModel";
import { NextResponse } from "next/server";


export async function POST(req) {
  try {
    await connectDB(); 
    const body = await req.json();
    const newTodo = new todoModel(body);
    const savedTodo = await newTodo.save();
    return NextResponse.json({ success: true, data: savedTodo }, { status: 201 });
  } catch (error) {
    console.error("Error creating todo:", error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}


export async function GET() {
  try {
    await connectDB(); 
    const todos = await todoModel.find();
    return NextResponse.json({ success: true, data: todos }, { status: 200 });
  } catch (error) {
    console.error("Error fetching todos:", error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}


export async function PATCH(req) {
  try {
    await connectDB(); 
    const { id, ...data } = await req.json();
    const updatedTodo = await todoModel.findByIdAndUpdate(id, data, { new: true });
    if (!updatedTodo) {
      return NextResponse.json({ success: false, error: "Todo not found" }, { status: 404 });
    }
    return NextResponse.json({ success: true, data: updatedTodo }, { status: 200 });
  } catch (error) {
    console.error("Error updating todo:", error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}


export async function DELETE(req) {
  try {
    await connectDB(); 
    const { id } = await req.json();
    const deletedTodo = await todoModel.findByIdAndDelete(id);
    if (!deletedTodo) {
      return NextResponse.json({ success: false, error: "Todo not found" }, { status: 404 });
    }
    return NextResponse.json({ success: true, data: deletedTodo }, { status: 200 });
  } catch (error) {
    console.error("Error deleting todo:", error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}