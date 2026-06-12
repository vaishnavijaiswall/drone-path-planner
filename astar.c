#include <stdio.h>
#include <stdlib.h>

#define MAX 20
#define INF 9999

int ROWS,COLS;

char grid[MAX][MAX];

int gCost[MAX][MAX];
int visited[MAX][MAX];

int parentRow[MAX][MAX];
int parentCol[MAX][MAX];

int startRow,startCol;
int endRow,endCol;

int dr[] = {-1,1,0,0};
int dc[] = {0,0,-1,1};

void inputGridSize()
{
    printf("Enter number of rows: ");
    scanf("%d",&ROWS);

    printf("Enter number of columns: ");
    scanf("%d",&COLS);
}

void inputGrid()
{
    int i,j;

    printf("\nEnter grid values:\n");

    for(i=0;i<ROWS;i++)
    {
        for(j=0;j<COLS;j++)
        {
            scanf(" %c",&grid[i][j]);
        }
    }
}

void findStartAndDestination()
{
    int i,j;

    for(i=0;i<ROWS;i++)
    {
        for(j=0;j<COLS;j++)
        {
            if(grid[i][j]=='S')
            {
                startRow=i;
                startCol=j;
            }

            if(grid[i][j]=='D')
            {
                endRow=i;
                endCol=j;
            }
        }
    }
}

int heuristic(int row,int col)
{
    return abs(endRow-row)+abs(endCol-col);
}

void initializeArrays()
{
    int i,j;

    for(i=0;i<ROWS;i++)
    {
        for(j=0;j<COLS;j++)
        {
            gCost[i][j]=INF;
            visited[i][j]=0;

            parentRow[i][j]=-1;
            parentCol[i][j]=-1;
        }
    }

    gCost[startRow][startCol]=0;
}

void findBestCell(int *bestRow,int *bestCol)
{
    int i,j;

    int bestF=INF;

    *bestRow=-1;
    *bestCol=-1;

    for(i=0;i<ROWS;i++)
    {
        for(j=0;j<COLS;j++)
        {
            if(!visited[i][j] &&
               grid[i][j]!='X')
            {
                int f=gCost[i][j]+heuristic(i,j);

                if(f<bestF)
                {
                    bestF=f;

                    *bestRow=i;
                    *bestCol=j;
                }
            }
        }
    }
}

void astar()
{
    int count;

    for(count=0;count<ROWS*COLS;count++)
    {
        int row,col;

        findBestCell(&row,&col);

        if(row==-1 || col==-1)
            break;

        visited[row][col]=1;

        if(row==endRow && col==endCol)
            return;

        int i;

        for(i=0;i<4;i++)
        {
            int newRow=row+dr[i];
            int newCol=col+dc[i];

            if(newRow>=0 &&
               newRow<ROWS &&
               newCol>=0 &&
               newCol<COLS)
            {
                if(grid[newRow][newCol]!='X' &&
                   !visited[newRow][newCol])
                {
                    int newCost=gCost[row][col]+1;

                    if(newCost<gCost[newRow][newCol])
                    {
                        gCost[newRow][newCol]=newCost;

                        parentRow[newRow][newCol]=row;
                        parentCol[newRow][newCol]=col;
                    }
                }
            }
        }
    }
}

void markPath()
{
    int row=endRow;
    int col=endCol;

    while(parentRow[row][col]!=-1)
    {
        if(grid[row][col]!='D')
        {
            grid[row][col]='*';
        }

        int tempRow=parentRow[row][col];
        int tempCol=parentCol[row][col];

        row=tempRow;
        col=tempCol;
    }
}

void printGrid()
{
    int i,j;

    printf("\nA* Shortest Path:\n\n");

    for(i=0;i<ROWS;i++)
    {
        for(j=0;j<COLS;j++)
        {
            printf("%c ",grid[i][j]);
        }

        printf("\n");
    }
}

int main()
{
    printf("====================================\n");
    printf(" DRONE DELIVERY PATH PLANNER\n");
    printf(" USING A* ALGORITHM\n");
    printf("====================================\n");

    inputGridSize();

    inputGrid();

    findStartAndDestination();

    initializeArrays();

    astar();

    if(gCost[endRow][endCol]==INF)
    {
        printf("\nNo Path Found!\n");
        return 0;
    }

    markPath();

    printGrid();

    printf("\nShortest Distance = %d\n",
           gCost[endRow][endCol]);

    return 0;
}

