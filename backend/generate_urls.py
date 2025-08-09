#!/usr/bin/env python3
"""
Generate 100 sample URLs and add them to the database
"""
import random
from app.db import get_session, create_db_and_tables
from app.models.url import URL
from app.utils.utils import encode_base62

# Sample URLs to choose from
sample_urls = [
    "https://www.google.com",
    "https://www.github.com",
    "https://www.stackoverflow.com",
    "https://www.reddit.com",
    "https://www.youtube.com",
    "https://www.wikipedia.org",
    "https://www.amazon.com",
    "https://www.netflix.com",
    "https://www.spotify.com",
    "https://www.twitter.com",
    "https://www.facebook.com",
    "https://www.instagram.com",
    "https://www.linkedin.com",
    "https://www.discord.com",
    "https://www.twitch.tv",
    "https://www.medium.com",
    "https://www.dev.to",
    "https://www.hashnode.com",
    "https://www.producthunt.com",
    "https://www.behance.net",
    "https://www.dribbble.com",
    "https://www.figma.com",
    "https://www.notion.so",
    "https://www.slack.com",
    "https://www.zoom.us",
    "https://www.dropbox.com",
    "https://www.trello.com",
    "https://www.asana.com",
    "https://www.airtable.com",
    "https://www.calendly.com",
    "https://www.stripe.com",
    "https://www.paypal.com",
    "https://www.shopify.com",
    "https://www.wordpress.com",
    "https://www.squarespace.com",
    "https://www.wix.com",
    "https://www.webflow.com",
    "https://www.bubble.io",
    "https://www.zapier.com",
    "https://www.ifttt.com",
    "https://www.integromat.com",
    "https://www.automate.io",
    "https://www.make.com",
    "https://www.n8n.io",
    "https://www.node-red.org",
    "https://www.home-assistant.io",
    "https://www.openhab.org",
    "https://www.domoticz.com",
    "https://www.homeseer.com",
    "https://www.control4.com",
    "https://www.crestron.com",
    "https://www.amx.com",
    "https://www.extron.com",
    "https://www.biamp.com",
    "https://www.shure.com",
    "https://www.sennheiser.com",
    "https://www.beyerdynamic.com",
    "https://www.audio-technica.com",
    "https://www.neumann.com",
    "https://www.akg.com",
    "https://www.rode.com",
    "https://www.blue.com",
    "https://www.focusrite.com",
    "https://www.uaudio.com",
    "https://www.avid.com",
    "https://www.steinberg.net",
    "https://www.celemony.com",
    "https://www.native-instruments.com",
    "https://www.ableton.com",
    "https://www.image-line.com",
    "https://www.cockos.com",
    "https://www.reaper.fm",
    "https://www.ardour.org",
    "https://www.audacityteam.org",
    "https://www.audition.adobe.com",
    "https://www.protools.com",
    "https://www.logicpro.com",
    "https://www.garageband.com",
    "https://www.cubase.com",
    "https://www.nuendo.com",
    "https://www.samplitude.com",
    "https://www.soundforge.com",
    "https://www.wavelab.com",
    "https://www.izotope.com",
    "https://www.waves.com",
    "https://www.fabfilter.com",
    "https://www.soundtoys.com",
    "https://www.valhalla.com",
    "https://www.arturia.com",
    "https://www.native-instruments.com",
    "https://www.ableton.com",
    "https://www.image-line.com",
    "https://www.cockos.com",
    "https://www.reaper.fm",
    "https://www.ardour.org",
    "https://www.audacityteam.org",
    "https://www.audition.adobe.com",
    "https://www.protools.com",
    "https://www.logicpro.com",
    "https://www.garageband.com",
    "https://www.cubase.com",
    "https://www.nuendo.com",
    "https://www.samplitude.com",
    "https://www.soundforge.com",
    "https://www.wavelab.com",
    "https://www.izotope.com",
    "https://www.waves.com",
    "https://www.fabfilter.com",
    "https://www.soundtoys.com",
    "https://www.valhalla.com",
    "https://www.arturia.com"
]

def generate_urls():
    """Generate 100 URLs and add them to the database"""
    print("Creating database tables...")
    create_db_and_tables()
    
    print("Generating 100 URLs...")
    session = get_session()
    
    # Generate 100 URLs
    for i in range(100):
        # Pick a random URL from the sample list
        long_url = random.choice(sample_urls)
        
        # Create new URL entry
        new_url_entry = URL(long_url=long_url)
        
        # Add to database to get the ID
        session.add(new_url_entry)
        session.commit()
        session.refresh(new_url_entry)
        
        # Generate short code based on the ID
        encoded_url = encode_base62(new_url_entry.id)
        new_url_entry.short_code = encoded_url
        
        # Update with the short code
        session.add(new_url_entry)
        session.commit()
        
        print(f"Created URL {i+1}/100: {encoded_url} -> {long_url}")
        print(f"Short URL: http://localhost:8000/shorten/{encoded_url}")

    
    print("✅ Successfully created 100 URLs!")
    
    # Show some statistics
    total_urls = session.query(URL).count()
    print(f"Total URLs in database: {total_urls}")

if __name__ == "__main__":
    generate_urls() 