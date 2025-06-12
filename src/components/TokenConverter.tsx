import React, { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { useToast } from '@/components/ui/use-toast';

interface TokenConverterProps {
  gameTokens: number;
  onConvert: (amount: number) => void;
}

const TokenConverter: React.FC<TokenConverterProps> = ({ gameTokens, onConvert }) => {
  const [convertAmount, setConvertAmount] = useState<number>(0);
  const { toast } = useToast();
  
  const handleSliderChange = (value: number[]) => {
    setConvertAmount(Math.floor(value[0]));
  };
  
  const handleMaxClick = () => {
    setConvertAmount(Math.floor(gameTokens));
  };
  
  const handleConvert = () => {
    if (convertAmount <= 0) {
      toast({
        title: "Invalid Amount",
        description: "Please select an amount greater than 0",
        variant: "destructive",
      });
      return;
    }
    
    if (convertAmount > gameTokens) {
      toast({
        title: "Insufficient Tokens",
        description: "You don't have enough tokens to convert",
        variant: "destructive",
      });
      return;
    }
    
    onConvert(convertAmount);
    toast({
      title: "Tokens Converted",
      description: `${convertAmount.toLocaleString()} tokens are now ready to claim!`,
    });
    setConvertAmount(0);
  };
  
  return (
    <Card className="p-4 mt-4 bg-card/90 backdrop-blur">
      <h3 className="text-lg font-semibold">Convert Game Tokens</h3>
      <p className="text-sm text-muted-foreground mb-4">
        Convert your in-game tokens to claimable tokens
      </p>
      
      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <span className="text-sm">Amount to Convert:</span>
          <div className="flex items-center gap-2">
            <span className="font-medium">{convertAmount.toLocaleString()}</span>
            <Button 
              variant="outline" 
              size="sm" 
              onClick={handleMaxClick}
              disabled={gameTokens <= 0}
            >
              Max
            </Button>
          </div>
        </div>
        
        <Slider
          defaultValue={[0]}
          max={gameTokens}
          step={1}
          value={[convertAmount]}
          onValueChange={handleSliderChange}
          disabled={gameTokens <= 0}
        />
        
        <div className="flex justify-between text-sm text-muted-foreground">
          <span>0</span>
          <span>{gameTokens.toLocaleString()}</span>
        </div>
        
        <Button 
          className="w-full" 
          onClick={handleConvert}
          disabled={convertAmount <= 0 || convertAmount > gameTokens}
        >
          Convert Tokens
        </Button>
      </div>
    </Card>
  );
};

export default TokenConverter;
