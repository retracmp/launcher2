const PanelWidget = () => {
  return (
    <div className="relative w-[50%] aspect-[16/9] min-w-max bg-neutral-800/10 rounded-xs border-[#2e2e2e] border-1 border-solid">
      <img
        className="absolute w-full h-full object-cover opacity-70"
        src="https://cdn2.unrealengine.com/Fortnite/fortnite-game/tournamentinformation/12BR_Competitive_In-Game_CashCup_Xbox_PS_ModeTile-1024x512-89a9551a7eadc187b77351500cc61290132e2e8e.jpg"
        draggable={false}
      />
    </div>
  );
};

export default PanelWidget;
