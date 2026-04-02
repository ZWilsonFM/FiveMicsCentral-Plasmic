import * as React from "react";
import {
  PlasmicCard,
  DefaultCardProps
} from "./plasmic/five_mics_central/PlasmicCard";
import { HTMLElementRefOf } from "@plasmicapp/react-web";
import { Card as CardType } from "@/lib/types";

export interface CardProps extends DefaultCardProps {
  card?: CardType;
  onAdd?: (card: CardType) => void;
  onRemove?: (cardId: number) => void;
}

function Card_(props: CardProps, ref: HTMLElementRefOf<"div">) {
  const { card, onAdd, onRemove, ...rest } = props;

  const handleAdd = React.useCallback(() => {
    if (onAdd && card) {
      onAdd(card);
    }
  }, [onAdd, card]);

  const handleRemove = React.useCallback(() => {
    if (onRemove && card) {
      onRemove(card.id);
    }
  }, [onRemove, card?.id]);

  if (card) {
    return (
      <PlasmicCard
        root={{ ref }}
        isUnique={card.is_unique}
        previewImageUrl={card.preview_image}
        plusButton={{ onClick: handleAdd }}
        minusButton={{ onClick: handleRemove }}
        {...rest}
      />
    );
  }

  return <PlasmicCard root={{ ref }} {...rest} />;
}

const Card = React.memo(React.forwardRef(Card_));
export default Card;
