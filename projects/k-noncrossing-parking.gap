#k-W-noncrossing parking function code
W:= ComplexReflectionGroup(6);
B:=DualBraidMonoid(W);
D:=DualBraid(W);
S:=LeftDivisorsSimple(B,B.delta);
A:=B.atoms;

#Gives all multichains begining with w
Multichains:=function(k,w)
    local MCw,L,MCu,R,u,M;
    MCw:=[];
    if k>1 then
        for R in S do 
            for u in R do
                if LeftGcd(D(w),D(u))[1]=D(w) then 
                    MCu:=Multichains(k-1,u);
                    for M in MCu do 
                        L:=[w];
                        Append(L,M);
                        if not(L in MCw) then 
                        Add(MCw,L);
                        fi;
                    od;
                fi;
            od;
        od;
    fi;

    if k=1 then
        MCw:=[[w]];
    fi;

    return MCw;
end;

#Gives all multichains begining with w
Mchains:=function(k,w)
	local i, MC, M, pi, R, u;
	i:=1;
	while i < k do 
		MC:= [[w]];
		for M in MC do 
			for R in S do 
				for u in R do
					pi:=M[Size(Set(M))];
					if LeftGcd(D(pi),D(u))[1]=D(pi) then 
						newM:=
						Add(MC,u);
					fi;
				od;
			od;
		od;
	i:=i+1;
	od;

	return MC;
end;

#Uses Multichains function to give all k-multichains 
NC_k:=function(k)
	local NC,R,u,MCu;
	NC:=[];
	for R in S do
		for u in R do
			MCu:=Multichains(k,u);
			Add(NC,MCu);
		od;
	od;
	return NC;
end;


#Gives all k parking functions as a list of entries [wW_x,x,x_1,...,x_{k-1}] of cosets and k-chains

Parking_k:=function(k)
	local P,R,u,MC,TNC,t,G,Wu,LC,L,c,Lc;
	P:=[];
	for R in S do
		for u in R do
			MC:=Multichains(k,u);
			TNC:=[]; #List the reflections below u 
			for t in A do 
				G:=LeftGcd(D(t),D(u));
				if G[1]=D(t) then
					Add(TNC,t);
				fi;
			od;
			Wu:=Subgroup(W,TNC);
			LC:=LeftCosets(W,Wu);
			for L in LC do
				for c in MC do
					Lc:=[L];
					Append(Lc,c);
					Add(P,Lc);
				od;
			od;
		od;
	od;
	return P;
end;

count:=0;
for R in S do 
	for j in R do 
		count:=count+1;
	od;
od;

for k in [1..count] do 
	Print(Size(Set(Parking_k(k))),"\n",k,"\n");
od;


