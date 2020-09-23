using System.Collections.Generic;
using HotChocolate.Resolvers;
using HotChocolate.Types;
using HotChocolate.Types.Relay;

using back.Data;
using back.DataLoader;


namespace back.Types 
{
    public class CardType : ObjectType<Card>
    {
        protected override void Configure(IObjectTypeDescriptor<Card> descriptor)
        {
            descriptor
                .AsNode()
                .IdField(t => t.Id)
                .NodeResolver((ctx, id) => 
                    ctx.DataLoader<CardByIdDataLoader>().LoadAsync(id, ctx.RequestAborted));
        }
    }
}