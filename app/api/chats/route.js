import { NextResponse } from "next/server";
import connecting from "../../../lib/db"
import Chat from "../../../lib/model/chat";

export async function GET(request) {
  await connecting();
  try {
      const allChats = await Chat.find().lean(); // Use lean() for better performance
      // Extract all messages into a single array with email
      const allMessages = allChats.flatMap(chat => 
          chat.msg.map(message => ({
              ...message, 
              email: chat.mailId 
          }))
      );

      const parseTime = (timeStr) => {
          const [timePart, modifier] = timeStr.split(' ');
          const [hours, minutes, seconds = "00"] = timePart.split(':'); // Handle missing seconds
          let parsedHours = parseInt(hours);
          
          // Convert to 24-hour format
          if (modifier === 'PM' && parsedHours !== 12) parsedHours += 12;
          if (modifier === 'AM' && parsedHours === 12) parsedHours = 0;
          
          return new Date(1970, 0, 1, parsedHours, parseInt(minutes), parseInt(seconds));
      };

      // Sort messages by their parsed time
      allMessages.sort((a, b) => parseTime(a.time) - parseTime(b.time));
      // console.log(allMessages)
      return NextResponse.json(allMessages);
  } catch (error) {
      console.error("Error fetching messages:", error);
      return NextResponse.json(
          { error: "Internal Server Error" },
          { status: 500 }
      );
  }
}

export async function POST(request) {
    await connecting();
  
    try {
      const body = await request.json();
      console.log(body);
  
      const { by, data, email, at } = body;
  
      let exist = await Chat.findOne({ mailId: email });
      console.log(exist)
  
      if (exist) {
        exist.msg.push({ message: data, time: at }); 
        await exist.save();
        console.log("Message added to existing chat.");
      } else {
        const db_val = new Chat({
          name: by,
          mailId: email,
          msg: [{ message: data, time: at }], 
        });
        await db_val.save();
        console.log("New chat created successfully.");
      }
      // Retrieve updated chat data
      const dat = await Chat.find();
      return NextResponse.json({ dat });
  
    } catch (error) {
      console.error("Error handling chat request:", error);
      return NextResponse.json({ error: "Something went wrong" }, { status: 500 });
    }
  }
// export async function DELETE(request) {
//     await connecting();
//     try {
//         const {searchParams} =request.nextUrl;
//         const query=searchParams.get("query")
//         const response= await Note.deleteOne({_id:query})
//         console.log(response);
//         return NextResponse.json({delete:query})

//     } catch (error) {
//         return NextResponse.json({ error: error.message }, { status: 500 });
//     }
// }
// export async function PUT(request) {
//     await connecting();
  
//     try {
//       const { searchParams } = request.nextUrl;
//       const id = searchParams.get("id");
  
//       if (!id) {
//         return NextResponse.json({ error: "Note ID is required" }, { status: 400 });
//       }
  
//       const body = await request.json();
//       const { title, body: noteBody } = body;
  
//       if (!title || !noteBody) {
//         return NextResponse.json({ error: "Title and body are required" }, { status: 400 });
//       }
  
//       const updatedNote = await Note.findByIdAndUpdate(
//         id,
//         { title, body: noteBody },
//         { new: true }
//       );
  
//       if (!updatedNote) {
//         return NextResponse.json({ error: "Note not found" }, { status: 404 });
//       }
  
//       return NextResponse.json({ success: true, note: updatedNote });
  
//     } catch (error) {
//       return NextResponse.json({ error: error.message }, { status: 500 });
//     }
//   }