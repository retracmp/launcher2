import { OptionGroup } from "src/components/core/option";
import UI from "src/components/core/default";
import Package from "./package";
import Effect from "./effect";

const StorePage = () => {
  return (
    <>
      <Effect />

      <OptionGroup _first>
        <div className="flex flex-col gap-[0.2rem]">
          <UI.H1 className="font-[300] text-neutral-300">Store</UI.H1>
          <UI.P className="text-neutral-400">
            Consider donating to help fund the development of Retrac. All
            donations go towards server costs, development tools and other
            expenses.
          </UI.P>
        </div>
      </OptionGroup>

      <OptionGroup title="Retrac Series" _animate>
        <Package
          donatePackageTag="carti"
          title="Carti Bundle"
          price={15}
          blurb="A simple bundle of Carti skins and emotes."
          iconImage="/donate/carti.webp"
          image="/donate/carti_big.jpg"
          _iconColour1="bg-orange-500"
          _iconColour2="bg-pink-500"
        />
        <Package
          donatePackageTag="gamer"
          title="Gamer Package"
          price={15}
          blurb="Obtain lots of Gaming Series favourites."
          iconImage="/donate/gamer.webp"
          image="/donate/gamer_big.jpg"
          _iconColour1="bg-green-500"
          _iconColour2="bg-lime-500"
          _doNotAllowPurchaseIfOwnedThese={["ultimate"]}
        />
        {/* <Package
          donatePackageTag="anime"
          title="Anime Legends Bundle"
          price={20}
          blurb="Unlock a wide range of anime inspred outfits."
          iconImage="/donate/anime.png"
          image="/donate/anime_big.png"
          _iconColour1="bg-yellow-500"
          _iconColour2="bg-red-400"
        /> */}
        <Package
          donatePackageTag="glider"
          title="Glorious Gliders"
          price={10}
          blurb="Play with four exclusive gliders and 5000 V-Bucks."
          iconImage="/donate/glider.png"
          image="/donate/glider_big.png"
          _iconColour1="bg-pink-500"
          _iconColour2="bg-fuchsia-400"
        />
        <Package
          donatePackageTag="tvseries"
          title="Television Bundle"
          price={15}
          blurb="Unlock a collection of popular television outfits."
          iconImage="/donate/dexter.png"
          image="/donate/dexter_big.png"
          _iconColour1="bg-blue-500"
          _iconColour2="bg-cyan-400"
        />
      </OptionGroup>

      <OptionGroup title="Offers" _animate>
        <Package
          donatePackageTag="crystal"
          title="Crystal Package"
          price={35}
          blurb="Unlock every Fortnite cosmetic in the game."
          iconImage="/donate/crystal.webp"
          image="/donate/crystal_big.jpg"
          _addPadding
          _iconColour1="bg-red-500"
          _iconColour2="bg-fuchsia-500"
        />
        <Package
          donatePackageTag="fncs"
          title="FNCS Bundle"
          price={20}
          blurb="Receive a collection of Fortnite Championship cosmetics."
          iconImage="/donate/fncs.webp"
          image="/donate/fncs_big.jpg"
          _addPadding
          _iconColour1="bg-yellow-500"
          _iconColour2="bg-blue-500"
        />
        <Package
          donatePackageTag="llama"
          title="OG Package"
          price={20}
          blurb="Gain access to a wide range of nostalgic skins."
          iconImage="/donate/og.webp"
          image="/donate/og_big.jpg"
          _iconColour1="bg-blue-500"
          _iconColour2="bg-purple-500"
          _doNotAllowPurchaseIfOwnedThese={["crystal"]}
        />
      </OptionGroup>
    </>
  );
};

export default StorePage;
