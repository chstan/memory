using System.Collections.Generic;
using HotChocolate.Resolvers;
using HotChocolate.Types;
using HotChocolate.Types.Relay;

using back.Data;
using back.DataLoader;


namespace back.Types 
{
    public class UserType : ObjectType<User>
    {
        protected override void Configure(IObjectTypeDescriptor<User> descriptor)
        {
            descriptor
                .AsNode()
                .IdField(t => t.Id)
                .NodeResolver((ctx, id) => 
                    ctx.DataLoader<UserByIdDataLoader>().LoadAsync(id, ctx.RequestAborted));
        }
    }
}