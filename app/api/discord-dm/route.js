import { NextResponse } from 'next/server';

export async function POST(request) {
  try {
    const { selections } = await request.json();

    const botToken = process.env.DISCORD_BOT_TOKEN;
    const userId = process.env.DISCORD_USER_ID;

    if (!botToken || !userId) {
      return NextResponse.json(
        { error: 'Serverkonfiguration mangler i .env.local' },
        { status: 500 }
      );
    }

    // Opret eller hent DM-kanal til din bruger-ID
    const dmChannelRes = await fetch('https://discord.com/api/v10/users/@me/channels', {
      method: 'POST',
      headers: {
        Authorization: `Bot ${botToken}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ recipient_id: userId }),
    });

    if (!dmChannelRes.ok) {
      const errorData = await dmChannelRes.json();
      return NextResponse.json(
        { error: 'Kunne ikke åbne DM kanal', details: errorData },
        { status: dmChannelRes.status }
      );
    }

    const dmChannel = await dmChannelRes.json();

    const name = selections['Navn'] || 'En bruger';
    const platform = selections['Platform'] || 'en streamingtjeneste';
    const situation = selections['Valgt Situation'] || 'en vilkårlig situation';
    const genres = selections['Foretrukne Genrer'] || 'forskellige genrer';
    const minSongs = selections['Minimum Sange'] || 'ikke angivet';
    const songs = selections['Inspirationssange'];

    // Opbyg naturlig dansk besked
    let messageText = `**${name}** har anmodet om en ny playliste på **${platform}**!\n\n`;
    messageText += `Playlisten skal bruges til **${situation.toLowerCase()}**, og stemningen skal primært læne sig op ad **${genres}**.\n\n`;
    messageText += `⏱️ **Ønsket længde & forventet tid:** ${minSongs}\n\n`;

    if (minSongs.includes('100+ sange')) {
      messageText += `⚠️ *Bemærk: ${name} valgte 100+ sange og skylder dig derfor noget i fremtiden!* 😉\n\n`;
    }

    if (songs && songs !== 'Ingen angivet (Sprunget over)') {
      messageText += `Som inspiration til tonen og stilen har ${name} fremhævet følgende sange:\n> 🎵 ${songs.split(' | ').join('\n> 🎵 ')}`;
    } else {
      messageText += `${name} tilføjede ikke nogen specifikke inspirationssange.`;
    }

    const discordPayload = {
      embeds: [
        {
          title: `🎧 Ny playliste-anmodning fra ${name}`,
          description: messageText,
          color: 3066993, // Mørkegrøn/emerald farvekode
          footer: { text: 'Music Playlist Generator • Next.js + Discord Bot' },
          timestamp: new Date().toISOString(),
        },
      ],
    };

    const messageRes = await fetch(
      `https://discord.com/api/v10/channels/${dmChannel.id}/messages`,
      {
        method: 'POST',
        headers: {
          Authorization: `Bot ${botToken}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(discordPayload),
      }
    );

    if (!messageRes.ok) {
      const errorData = await messageRes.json();
      return NextResponse.json(
        { error: 'Kunne ikke sende beskeden til Discord', details: errorData },
        { status: messageRes.status }
      );
    }

    return NextResponse.json({ success: true, message: 'Playlisten blev leveret!' });
  } catch (error) {
    return NextResponse.json(
      { error: 'Interne serverfejl', details: error.message },
      { status: 500 }
    );
  }
}